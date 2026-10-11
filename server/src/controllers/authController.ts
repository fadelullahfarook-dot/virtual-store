import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User';
import Otp from '../models/Otp';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer transporter (Uses Gmail by default for easy setup)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Needs an App Password, not regular password
  },
});

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, method } = req.body; // method: 'email' | 'phone'
    
    if (!identifier) {
      res.status(400).json({ message: 'Identifier is required' });
      return;
    }

    // Check for recent OTP to implement cooldown
    const recentOtp = await Otp.findOne({ identifier }).sort({ createdAt: -1 });
    if (recentOtp && (Date.now() - recentOtp.createdAt.getTime() < 30000)) {
      res.status(429).json({ message: 'Please wait 30 seconds before requesting another OTP' });
      return;
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await Otp.create({
      identifier,
      otp: otpCode,
      expiresAt,
    });

    if (method === 'email' || identifier.includes('@')) {
      // Send real email OTP
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEVELOPMENT] Email not configured. OTP for ${identifier} is ${otpCode}`);
      } else {
        const mailOptions = {
          from: `"Virtual Store" <${process.env.EMAIL_USER}>`,
          to: identifier,
          subject: 'Your Virtual Store Login Code',
          text: `Your verification code is: ${otpCode}. It expires in 5 minutes.`,
          html: `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                  <h2>Welcome to Virtual Store!</h2>
                  <p>Your verification code is:</p>
                  <h1 style="color: #4f46e5; letter-spacing: 5px;">${otpCode}</h1>
                  <p>This code expires in 5 minutes.</p>
                 </div>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email OTP sent to ${identifier}`);
      }
    } else {
      // For phone, just log it until SMS is configured
      console.log(`[DEVELOPMENT] Phone OTP for ${identifier} is ${otpCode}`);
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, name, isNewUser } = req.body;

    const otpRecord = await Otp.findOne({ identifier, otp });

    if (!otpRecord) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (new Date() > otpRecord.expiresAt) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    let user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (isNewUser && !user) {
      const authProvider = identifier.includes('@') ? 'email' : 'phone';
      user = await User.create({
        name: name || 'User',
        [authProvider]: identifier,
        authProvider,
      });
    } else if (!user) {
      res.status(404).json({ message: 'User not found. Please sign up.' });
      return;
    }

    // Delete OTP after successful use
    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_development_only', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        provider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token: accessToken } = req.body;

    if (!accessToken) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    // Fetch user info from Google using the access token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleRes.ok) {
      res.status(401).json({ message: 'Invalid Google token' });
      return;
    }

    const payload = await googleRes.json();
    
    // Payload contains: sub (providerId), email, name, picture
    const { sub, email, name, picture } = payload;

    // Find user by email or providerId
    let user = await User.findOne({
      $or: [{ providerId: sub }, { email }],
    });

    if (!user) {
      // Create new user
      user = await User.create({
        name: name || 'Google User',
        email,
        authProvider: 'google',
        providerId: sub,
        profileImage: picture,
      });
    } else if (user.authProvider !== 'google') {
      // Link Google account to existing email account
      user.providerId = sub;
      user.profileImage = picture || user.profileImage;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_development_only', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        provider: 'google',
      },
    });
  } catch (error) {
    console.error('Error in googleAuth:', error);
    res.status(500).json({ message: 'Server error while verifying Google identity' });
  }
};
