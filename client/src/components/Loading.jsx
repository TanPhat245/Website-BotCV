const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white bg-opacity-70 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default FullPageLoader;
