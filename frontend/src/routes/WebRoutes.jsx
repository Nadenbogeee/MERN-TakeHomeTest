import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const WebRoutes = () => {
  const JobDetails = lazy(() => import("../dashboard/JobDetails"));
  const DashboardPage = lazy(() => import("../dashboard/Dashboard"));
  const LoginPage = lazy(() => import("../login/LoginRegister"));
  const RegisterPage = lazy(() => import("../login/RegisterLogin"));
  const NooTokenPage = lazy(() => import("../login/NooToken"));

  return (
    <>
      <Routes>
        <Route
          element={
            <Suspense fallback={"Wait a sec"}>
              <DashboardPage />
            </Suspense>
          }
          path="/dashboard"
        />
        <Route
          element={
            <Suspense fallback={"Wait a sec"}>
              <LoginPage />
            </Suspense>
          }
          path="/"
        />
        <Route
          element={
            <Suspense fallback={"Wait a sec"}>
              <RegisterPage />
            </Suspense>
          }
          path="/register"
        />
        <Route
          element={
            <Suspense fallback={"Wait a sec"}>
              <JobDetails />
            </Suspense>
          }
          path="/dashboard/job-details/:id"
        />
        <Route
          element={
            <Suspense fallback={"Wait a sec"}>
              <NooTokenPage />
            </Suspense>
          }
          path="/YouhadNoToken"
        />
      </Routes>
    </>
  );
};

export default WebRoutes;
