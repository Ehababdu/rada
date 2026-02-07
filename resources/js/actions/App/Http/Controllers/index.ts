import Auth from './Auth'
import EmploymentStatusController from './EmploymentStatusController'
import MilitaryRankController from './MilitaryRankController'
import BankController from './BankController'
import BranchController from './BranchController'
import EmployerController from './EmployerController'
import EmployerLocationController from './EmployerLocationController'
import Api from './Api'
import MartyrController from './MartyrController'
import DashboardController from './DashboardController'
import ReportsController from './ReportsController'
import AttachmentController from './AttachmentController'
import AttachmentTypeController from './AttachmentTypeController'
import PromotionController from './PromotionController'
import CompensationController from './CompensationController'
import JobGradeController from './JobGradeController'
import UserController from './UserController'
import PermissionController from './PermissionController'
import RoleController from './RoleController'
import AlertController from './AlertController'
import ActivityLogController from './ActivityLogController'
import Settings from './Settings'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    EmploymentStatusController: Object.assign(EmploymentStatusController, EmploymentStatusController),
    MilitaryRankController: Object.assign(MilitaryRankController, MilitaryRankController),
    BankController: Object.assign(BankController, BankController),
    BranchController: Object.assign(BranchController, BranchController),
    EmployerController: Object.assign(EmployerController, EmployerController),
    EmployerLocationController: Object.assign(EmployerLocationController, EmployerLocationController),
    Api: Object.assign(Api, Api),
    MartyrController: Object.assign(MartyrController, MartyrController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    ReportsController: Object.assign(ReportsController, ReportsController),
    AttachmentController: Object.assign(AttachmentController, AttachmentController),
    AttachmentTypeController: Object.assign(AttachmentTypeController, AttachmentTypeController),
    PromotionController: Object.assign(PromotionController, PromotionController),
    CompensationController: Object.assign(CompensationController, CompensationController),
    JobGradeController: Object.assign(JobGradeController, JobGradeController),
    UserController: Object.assign(UserController, UserController),
    PermissionController: Object.assign(PermissionController, PermissionController),
    RoleController: Object.assign(RoleController, RoleController),
    AlertController: Object.assign(AlertController, AlertController),
    ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers