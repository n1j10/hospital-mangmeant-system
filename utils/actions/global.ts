// One place to import every action from: `import { fetchPatients } from "@/actions"`
// (old imports from "./global" keep working).


export { renderError } from "./helpers";

export {
  getAuthUser,
  getAdminUser,
} from "./user";


export {
  loginAction,
  registerAction,
  logoutAction,
  getCurrentUser,
} from "./auth";


export {
  fetchUsers,
  deleteUserAction,
} from "./accounts";


export {
  fetchDashboardStats,
  fetchNavbarNotifications,
  fetchRecentAppointments,
} from "./dashboard";


export {
  fetchDepartments,
  fetchSingleDepartment,
  fetchAllDepartmentsForSelect,
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} from "./departments";


export {
  fetchDoctors,
  fetchSingleDoctor,
  fetchAllDoctorsForSelect,
  createDoctorAction,
  deleteDoctorAction,
} from "./doctors";


export {
  fetchPatients,
  fetchSinglePatient,
  fetchAllPatientsForSelect,
  createPatientAction,
  updatePatientAction,
  deletePatientAction,
} from "./patients";


export {
  fetchAppointments,
  fetchSingleAppointment,
  fetchCompletedAppointmentsWithoutConsultation,
  createAppointmentAction,
  updateAppointmentStatusAction,
  deleteAppointmentAction,
} from "./appointments";


export {
  fetchConsultations,
  fetchSingleConsultation,
  createConsultationAction,
} from "./consultations";


export {
  fetchAdmissions,
  fetchSingleAdmission,
  createAdmissionAction,
  dischargePatientAction,
} from "./admissions";


export {
  fetchCategories,
  createCategoryAction,
  deleteCategoryAction,
} from "./categories";


export {
  fetchMedicines,
  fetchSingleMedicine,
  fetchLowStockMedicines,
  fetchExpiringMedicines,
  createMedicineAction,
  updateMedicineAction,
  deleteMedicineAction,
} from "./medicines";


export {
  addPrescriptionItemAction,
  removePrescriptionItemAction,
} from "./prescriptions";
