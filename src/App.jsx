import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/LoginSugnup/Login";
import EducationalDetailsForm from "./components/Form/EducationalDetails";

import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

import AdminLogin from "./components/adminCompoments/AdminLoginSignup/AdminLogin";
import AdminDashboard from "./components/adminCompoments/AdminDashboard";

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
import AllStudentResult from "./components/adminCompoments/AllStudentResult";
import AddExamDate from "./components/adminCompoments/AddExamDate";
import DownloadResult from "./components/adminCompoments/DownloadResult";
import CloudinaryUpload from "./components/adminCompoments/CloudinaryUpload";
import CloudinaryComponent from "./components/adminCompoments/CloudinaryComponent";
import BatchRelatedDetailsForm from "./components/Form/BatchRelatedDetails";
import FamilyDetails from "./components/Form/FamilyDetails";
import SelfieCapture from "./components/SelfieCapture";
import TermsAndConditionPage from "./components/Policy/TermsAndConditionPage";
import ContactUsPage from "./components/Policy/ContactUsPage";
import PrivacyPolicy from "./components/Policy/PrivacyPolicy";
import CancellationsAndRefunds from "./components/Policy/CancellationsAndRefunds";
import ExistingStudent from "./components/ExistingStudent";
import ShowEnquiryOFExistingStudentDetails from "./components/ShowEnquiryOFExistingStudentDetails";
import FaceDetectionUpload from "./components/FaceDetection";
import CreateInvoice from "./components/CreateInvoice";
import AllFormsComponents from "./components/adminCompoments/AllFormsComponents";
import RiseFee from "./components/adminCompoments/RiseFee/RiseFee";
import LockNavigation from "./utils/LockNavigator";
import Amount from "./components/adminCompoments/Amount";
import AddStudentRegistartionComponent from "./components/adminCompoments/AddStudentRegistration/AddStudentRegistartionComponent";
import PaymentSuccess from "./components/PaymentSuccessMessage";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <LockNavigation />
          <div className="p-0 m-0">
            <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={<AdminPrivateRoute component={AdminDashboard} />}
              />
              <Route
                path="/admin/allStudents"
                element={<AdminPrivateRoute component={AllStudentResult} />}
              />
              <Route
                path="/admin/addExamDate"
                element={<AdminPrivateRoute component={AddExamDate} />}
              />
              <Route
                path="/admin/downloadResult"
                element={<AdminPrivateRoute component={DownloadResult} />}
              />
              <Route
                path="/admin/CloudinaryUpload"
                element={<AdminPrivateRoute component={CloudinaryComponent} />}
              />
              <Route
                path="/admin/allForms"
                element={<AdminPrivateRoute component={AllFormsComponents} />}
              />
              <Route
                path="/admin/formFee"
                element={<AdminPrivateRoute component={RiseFee} />}
              />
              <Route
                path="/admin/amount"
                element={<AdminPrivateRoute component={Amount} />}
              />
              <Route
                path="/admin/add-student-registration"
                element={
                  <AdminPrivateRoute component={AddStudentRegistartionComponent} />
                }
              />
              <Route path="/facedetection" element={<FaceDetectionUpload />} />

              <Route path="/" element={<Signup />} />

              {/* <Route
                path="/registration/existingStudent"
                element={<ExistingStudent />}
              /> */}
              <Route
                path="/registration/existingStudent"
                element={<PrivateRoute component={ExistingStudent} />}
              />
              <Route
                path="/registration/existingenquiry"
                element={
                  <PrivateRoute
                    component={ShowEnquiryOFExistingStudentDetails}
                  />
                }
              />

              <Route
                path="/registration/basicDetailsForm"
                element={<PrivateRoute component={BasicDetailsForm} />}
              />
            
              <Route
                path="/registration/batchDetailsForm"
                element={<PrivateRoute component={BatchRelatedDetailsForm} />}
              />


              
              <Route
                path="/registration/familyDetailsForm"
                element={<PrivateRoute component={FamilyDetails} />}

              />


                <Route
                path="/registration/educationalDetailsForm"
                element={<PrivateRoute component={EducationalDetailsForm} />}
              />

                <Route
                path="/registration/success"
                element={<PrivateRoute component={PaymentSuccess} />}
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

            
              {/* <Route path="/CreateInvoice" element={<CreateInvoice />} /> */}
              {/* <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              /> */}
              <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              />
              {/* <Route path="/examDetails" element={<ExamDetails />} /> */}
              <Route path="/showMessage" element={<ShowMessage />} />
              <Route path="/forgetPassword" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* <Route path="result" element={<ResultPage />} /> */}
              {/* <Route
                path="/FormDetailPage"
                element={<PrivateRoute component={FormDetailPage} />}
              /> */}
              {/* <Route
                path="/resultDetails"
                element={<PrivateRoute component={ResultPage} />}
              /> */}
              <Route
                path="/registration/payment"
                element={<PrivateRoute component={Payment} />}
              />
              {/* <Route
                path="/payment/success/:payment_id"
                element={<PrivateRoute component={PaymentSuccessMessage} />}
              /> */}
              {/* <Route
                path="/result"
                element={<PrivateRoute component={Result} />}
              /> */}
              <Route path="/spinner" element={<Spinner />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
