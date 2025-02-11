import React, { useState, useEffect } from 'react';
import { Egg, Volume2, VolumeX, ArrowLeft, Heart } from 'lucide-react';

type EggType = {
  name: string;
  time: number;
  description: string;
};

const eggTypes: EggType[] = [
  { name: 'Soft & runny', time: 6, description: 'Silky yolk, perfect for dipping!' },
  { name: 'Medium', time: 8, description: 'Just the right balance of soft & firm!' },
  { name: 'Hard-boiled', time: 12, description: 'Firm, protein-packed, and ready to go!' },
];

const messages = [
  "Ohh, it's getting warm in here! But don't worry, I'll be yummy soon! 😚",
  "Just a little more patience... I promise it'll be worth it! 😘",
  "Almost there! Getting nice and cozy! 🥰",
  "Dancing with my animal friends while I cook! 💃",
  "The bunnies are cheering me on! 🐰✨",
  "Look at those cute chicks running around! 🐥",
];

const Animal = ({ type, position }: { type: 'chick' | 'bunny' | 'hen', position: number }) => {
  const colors = {
    chick: 'text-yellow-400',
    bunny: 'text-pink-200',
    hen: 'text-orange-400'
  };

  return (
    <div 
      className={`absolute ${colors[type]} transition-all duration-1000 animate-bounce`}
      style={{ 
        left: `${position}%`,
        bottom: type === 'bunny' ? '10%' : '5%',
        transform: `scale(${type === 'hen' ? 1.2 : 0.8})`,
      }}
    >
      {type === 'chick' && <span className="text-2xl">🐥</span>}
      {type === 'bunny' && <span className="text-2xl">🐰</span>}
      {type === 'hen' && <span className="text-2xl">🐔</span>}
    </div>
  );
};

function App() {
  const [selectedType, setSelectedType] = useState<EggType | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animalPositions, setAnimalPositions] = useState({
    chick: -10,
    bunny: 110,
    hen: -20
  });

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          setProgress(((selectedType?.time || 0) * 60 - newTime) / ((selectedType?.time || 0) * 60) * 100);
          return newTime;
        });
        
        // Update messages randomly
        if (Math.random() < 0.1) {
          setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }

        // Animate animals
        setAnimalPositions(prev => ({
          chick: (prev.chick + 1) % 120 - 10,
          bunny: 110 - ((prev.bunny + 0.5) % 120),
          hen: (prev.hen + 0.3) % 140 - 20
        }));
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setMessage("Ta-da! Your egg is ready, chef! Crack me open with love! 😘");
      setShowConfetti(true);
      if (!isMuted) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.play();
      }
      setTimeout(() => setShowConfetti(false), 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, selectedType, isMuted]);

  const startTimer = (type: EggType) => {
    setSelectedType(type);
    setTimeLeft(type.time * 60);
    setIsActive(true);
    setMessage("Your egg is soaking in the hot tub... 🛁");
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setSelectedType(null);
    setProgress(0);
    setMessage("");
    setShowConfetti(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEggColor = () => {
    if (!isActive) return 'text-yellow-200';
    if (progress < 33) return 'text-yellow-200';
    if (progress < 66) return 'text-yellow-300';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 animate-fall delay-100">🎉</div>
            <div className="absolute top-0 right-1/4 animate-fall delay-300">✨</div>
            <div className="absolute top-0 left-1/2 animate-fall delay-500">🎈</div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Egg className={`w-8 h-8 ${getEggColor()} transition-colors duration-500 ${isActive ? 'animate-wiggle' : ''}`} />
            Eggsy
          </h1>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>

        {!isActive && !timeLeft ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 mb-6">How do you like your egg today, my dear chef? 🥚✨</p>
            {eggTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => startTimer(type)}
                className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-all hover:shadow-md group"
              >
                <div className="text-left flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{type.name} ({type.time} min)</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  <Heart className="w-5 h-5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto relative">
                <Egg 
                  className={`w-full h-full ${getEggColor()} transition-colors duration-500 ${timeLeft === 0 ? 'animate-bounce' : 'animate-pulse'}`}
                />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 rounded-full h-2 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-600 animate-bounce min-h-[3rem]">
              {message}
            </p>
            <div className="space-y-3">
              {isActive ? (
                <button
                  onClick={() => setIsActive(false)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border-2 border-yellow-200 hover:border-yellow-300 transition-all hover:shadow-md group flex items-center justify-center gap-2 w-full"
                >
                  <Egg className="w-5 h-5 text-yellow-500 group-hover:-rotate-12 transition-transform" />
                  <span className="text-yellow-700">Let's cook another egg! 🍳</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Animal animations */}
        {(isActive || timeLeft === 0) && (
          <div className="relative h-16 mt-4">
            <Animal type="chick" position={animalPositions.chick} />
            <Animal type="bunny" position={animalPositions.bunny} />
            <Animal type="hen" position={animalPositions.hen} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;