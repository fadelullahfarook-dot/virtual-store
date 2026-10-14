declare module 'aframe' {
  const AFRAME: any;
  export default AFRAME;
}

declare global {
  interface Window {
    AFRAME: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-box': any;
      'a-plane': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-cone': any;
      'a-sky': any;
      'a-camera': any;
      'a-cursor': any;
      'a-text': any;
      'a-image': any;
      'a-light': any;
      'a-assets': any;
      'a-asset-item': any;
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-box': any;
      'a-plane': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-cone': any;
      'a-sky': any;
      'a-camera': any;
      'a-cursor': any;
      'a-text': any;
      'a-image': any;
      'a-light': any;
      'a-assets': any;
      'a-asset-item': any;
      [elemName: string]: any;
    }
  }
}

export {};
