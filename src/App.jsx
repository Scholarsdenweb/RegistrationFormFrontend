import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/LoginSugnup/Login";
import EducationalDetailsForm from "./components/Form/EducationalDetails";

import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import EmployeeLogin from "./components/employeeCompoments/EmployeeeLoginSignup/EmployeeLogin";
import EmployeeDashboard from "./components/employeeCompoments/EmployeeDashboard";

import BasicDetailsForm from "./components/Form/BasicDetails";
import Signup from "./components/LoginSugnup/Signup";
import ExamDetails from "./components/ExamDetails";
import ShowMessage from "./components/ShowMessage";
import Dashboard from "./components/Dashboard";
import { Provider } from "react-redux";
import store from "./redux/store";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import ResultPage from "./components/ResultPage";
import FormDetailPage from "./components/FormDetailPage";
import Spinner from "./api/Spinner";
import Payment from "./components/Payment";
import Result from "./components/Result";
import AllStudentResult from "./components/employeeCompoments/AllStudentResult";
import AddExamDate from "./components/employeeCompoments/AddExamDate";
import DownloadResult from "./components/employeeCompoments/DownloadResult";
import CloudinaryUpload from "./components/employeeCompoments/CloudinaryUpload";
import CloudinaryComponent from "./components/employeeCompoments/CloudinaryComponent";
import BatchRelatedDetailsForm from "./components/Form/BatchRelatedDetails";
import FamilyDetails from "./components/Form/FamilyDetails";
import SelfieCapture from "./components/SelfieCapture";
import TermsAndConditionPage from "./components/Policy/TermsAndConditionPage";
import ContactUsPage from "./components/Policy/ContactUsPage";
import PrivacyPolicy from "./components/Policy/PrivacyPolicy";
import CancellationsAndRefunds from "./components/Policy/CancellationsAndRefunds";
import ExistingStudent from "./components/ExistingStudent";
import EnquiryData from "./components/EnquiryData";
import FaceDetectionUpload from "./components/FaceDetection";
import CreateInvoice from "./components/CreateInvoice";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="p-0 m-0">
            <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route path="/employee" element={<EmployeeLogin />} />
              <Route
                path="/employee/dashboard"
                element={<PrivateRoute component={EmployeeDashboard} />}
              />
              <Route
                path="/employee/allStudents"
                element={<AllStudentResult />}
              />
              <Route path="/employee/addExamDate" element={<AddExamDate />} />
              <Route
                path="/employee/downloadResult"
                element={<DownloadResult />}
              />
              <Route
                path="/employee/CloudinaryUpload"
                element={<CloudinaryComponent />}
              />
              <Route path="/facedetection" element={<FaceDetectionUpload />} />

              <Route path="/" element={<Signup />} />
              <Route
                path="/registration/educationalDetailsForm"
                element={<EducationalDetailsForm />}
              />
              <Route
                path="/registration/basicDetailsForm"
                element={<BasicDetailsForm />}
              />
              <Route
                path="/registration/batchDetailsForm"
                element={<BatchRelatedDetailsForm />}
              />
              <Route
                path="/registration/familyDetailsForm"
                element={<FamilyDetails />}
              />
              <Route
                path="/registration/selfieCapture"
                element={<SelfieCapture />}
              />
              <Route
                path="/registration/termsAndCondition"
                element={<TermsAndConditionPage />}
              />
              <Route
                path="/registration/contactUsPage"
                element={<ContactUsPage />}
              />
              <Route
                path="/registration/privacyPolicy"
                element={<PrivacyPolicy />}
              />
              <Route
                path="/registration/cancellationsAndRefunds"
                element={<CancellationsAndRefunds />}
              />
              <Route
                path="/registration/existingStudent"
                element={<ExistingStudent />}
              />
              <Route
                path="/registration/enquiryData"
                element={<EnquiryData />}
              />

              <Route path="/CreateInvoice" element={<CreateInvoice />} />

              <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              />
              <Route path="/examDetails" element={<ExamDetails />} />
              <Route path="/showMessage" element={<ShowMessage />} />
              <Route path="/forgetPassword" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* <Route path="result" element={<ResultPage />} /> */}
              <Route
                path="/FormDetailPage"
                element={<PrivateRoute component={FormDetailPage} />}
              />
              <Route
                path="/resultDetails"
                element={<PrivateRoute component={ResultPage} />}
              />
              <Route path="/registration/payment" element={<Payment />} />
              {/* <Route
                path="/payment/success/:payment_id"
                element={<PrivateRoute component={PaymentSuccessMessage} />}
              /> */}
              <Route
                path="/result"
                element={<PrivateRoute component={Result} />}
              />

              <Route path="/spinner" element={<Spinner />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
