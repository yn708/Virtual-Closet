const SubmitLoading = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      data-testid="loading-container"
    >
      <div
        className="animate-spin size-6 border-2 border-white rounded-full border-t-transparent"
        data-testid="loading-spinner"
      ></div>
    </div>
  );
};

export default SubmitLoading;
