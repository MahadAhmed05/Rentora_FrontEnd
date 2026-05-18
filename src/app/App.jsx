import PageLoader from "../components/loader/PageLoader";
import { usePageLoader } from "../hooks/usePageLoader";
import { Router } from "../routes/Router";

const App = () => {
  const loading = usePageLoader();

  return (
    <>
      {loading && <PageLoader />}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        <Router />
      </div>
    </>
  );
};

export default App;
