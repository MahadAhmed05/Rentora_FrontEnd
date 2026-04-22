import { Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { routeDirectory } from "./routeDirectory";
import { CustomRoute } from "./CustomRoute";

export const Router = () => {
  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>
      <Routes>
        {Object.values(routeDirectory).map((route) => {
          if (Array.isArray(route.children) && route.children.length > 0) {
            return (
              <Route
                key={route.raw}
                path={route.raw}
                element={<CustomRoute route={route} />}
              >
                {route.children.map((child) => {
                  if (child.index) {
                    return (
                      <Route
                        key={`${route.raw}-index`}
                        index
                        element={<Navigate to={child.redirectTo} replace />}
                      />
                    );
                  }

                  return (
                    <Route
                      key={`${route.raw}-${child.path}`}
                      path={child.path}
                      element={<child.component />}
                    />
                  );
                })}
              </Route>
            );
          }

          return (
            <Route
              key={route.raw}
              path={route.raw}
              element={<CustomRoute route={route} />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};
