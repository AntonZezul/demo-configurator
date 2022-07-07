import { createContext, useState } from 'react';
export const MainContext = createContext();

export const ProviderFactory = () => {
  const [canvas, setCanvas] = useState(null);

  return {
    getCanvas: () => canvas,
    setCanvas: (canvas) => setCanvas(canvas),
  };
};

export const MainProvider = ({ children }) => {
  return <MainContext.Provider value={ProviderFactory()}>{children}</MainContext.Provider>;
};

export default MainContext;
