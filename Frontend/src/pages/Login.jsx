import { Fragment, Suspense } from "react";
import { Helmet } from "react-helmet";
import InitLoader from "../layout/InitLoader";
import LoginComponent from "../components/LoginComponent";

const Login = () => {
  return (
   <Fragment>

          <Suspense fallback={<InitLoader />}>
            <Helmet>
              <title>Login || React Portfolio</title>
              <meta
                name="description"
                content="React Portfolio Template"
              />
            </Helmet>
            <LoginComponent />
          </Suspense>
      </Fragment>
  )
}

export default Login