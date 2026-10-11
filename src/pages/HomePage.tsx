import { Link } from 'react-router-dom';
import { ShoppingBag, Map, Box, Search, ShoppingCart } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-indigo-50 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Experience Shopping in a New Way
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a browser-based 3D virtual shopping environment where you can walk through virtual streets, explore different stores and discover products in an immersive shopping experience.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/store" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Enter Virtual Store
            </Link>
            <a href="#how-it-works" className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-xl font-bold text-lg shadow-sm hover:bg-indigo-50 transition-all">
              Explore How It Works
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">What is Virtual Store?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Virtual Store is a browser-based 3D e-commerce experience designed to make online shopping feel more like visiting a physical shopping area. Walk down the street, see storefronts, and click to enter shops to browse their normal 2D product catalogs. No special headsets or downloads required—it all works right in your web browser.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
            {[
              { step: '01', title: 'Enter the Virtual Store', icon: <Map className="w-8 h-8" /> },
              { step: '02', title: 'Walk through the 3D Shopping Street', icon: <Box className="w-8 h-8" /> },
              { step: '03', title: 'Explore Different Stores', icon: <ShoppingBag className="w-8 h-8" /> },
              { step: '04', title: 'Browse Products', icon: <Search className="w-8 h-8" /> },
              { step: '05', title: 'Add to Cart & Shop', icon: <ShoppingCart className="w-8 h-8" /> }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <div className="text-indigo-600">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Interactive 3D shopping environment",
              "First-person exploration",
              "Virtual stores",
              "Normal product browsing",
              "Search and filtering",
              "Shopping cart",
              "Future AI shopping assistant"
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">✓</div>
                <p className="font-medium text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to Explore?</h2>
          <p className="text-indigo-100 text-lg">
            Join now and experience the next generation of e-commerce.
          </p>
          <Link to="/store" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-50 transition-all">
            Enter Virtual Store
          </Link>
        </div>
      </section>
    </div>
  );
};
