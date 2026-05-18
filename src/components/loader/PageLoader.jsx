import "./PageLoader.css";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255, 255, 255, 0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const PageLoader = () => {
  return (
    <div style={overlayStyle} aria-busy="true" aria-label="Loading page">
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default PageLoader;
