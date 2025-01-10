import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Beartrap from './models/Beartrap';
import Watch from './models/Watch';
function App() {

  const [isRotating, setIsRotating] = useState(false)
  const [keysPressed, setKeysPressed] = useState([]); // Track pressed keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!keysPressed.includes(event.key)) {
        setKeysPressed((prevKeys) => [...prevKeys, event.key]);
      }
    };

    const handleKeyUp = (event) => {
      setKeysPressed((prevKeys) => prevKeys.filter((key) => key !== event.key));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed]);
  const adjustBeartrap = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 0.5, 0];
    // can setup different scales based upon screen size and position and rotation
    // in this case we will have same size of the character
    if (window.innerWidth < 768) {
      screenScale = [1000, 1000, 1000];
    } else {
      screenScale = [1000, 1000, 1000];
    }

    return { screenScale, screenPosition, rotation };
  }

  const { screenScale, screenPosition, rotation } = adjustBeartrap();

  return (
    <>
      <section className='w-full h-screen relative'>
        <Canvas
          className={`w-full h-full bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
          camera={{ near: 0.9, far: 1000, position: [0, 0, 50] }}
        >
          <Suspense fallback={<Loader />}>

            <directionalLight
              position={[5, 10, 15]}
              intensity={1.5}
              castShadow
            />
            {/* Spotlight */}
            <spotLight
              position={[10, 20, 10]}
              angle={0.3}
              penumbra={1}
              intensity={2}
              color="#ffffff"
              castShadow
            />
            {/* Ambient light */}
            <ambientLight intensity={0.5} color="#ffffff" />
            {/* Hemisphere light */}
            <hemisphereLight skyColor="#ddddff" groundColor="#444488" intensity={0.5} />


            <Watch
              position={screenPosition}
              scale={screenScale}
              rotation={rotation}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
            />
          </Suspense>
        </Canvas>

        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
          }}
        >
          {keysPressed.length > 0 ? (
            <p>Keys pressed: {keysPressed.join(' + ')}</p>
          ) : (
            <p>No keys pressed</p>
          )}
        </div>
      </section>
    </>
  )
}

export default App
