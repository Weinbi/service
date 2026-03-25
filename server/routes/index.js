const Router = require('@koa/router');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/rbac');
const StatisticController = require('../controllers/statisticController');
const UserController = require('../controllers/userController');
const CampusController = require('../controllers/campusController');
const RoleController = require('../controllers/roleController');
const StudentController = require('../controllers/studentController');
const CourseController = require('../controllers/courseController');
const ClassController = require('../controllers/classController');
const TextbookController = require('../controllers/textbookController');
const ContractController = require('../controllers/contractController');
const FinancialRecordController = require('../controllers/financialRecordController');

const router = new Router();

// 示例 1: 查看文章 (所有登录且有 'article:read' 权限的用户)
router.get('/api/articles', authMiddleware, checkPermission('article:read'), async (ctx) => { ctx.body = { message: '这是文章列表数据' }; });

// === 公开接口 ===
router.post('/api/register', AuthController.register);
router.post('/api/login', AuthController.login);

// 修改密码接口
router.post('/api/user/change-password', authMiddleware, UserController.changePassword);
// === 个人中心相关接口 (需登录) ===
router.get('/api/users/profile', authMiddleware, UserController.getProfile);
router.put('/api/users/profile', authMiddleware, UserController.updateProfile);

// === 用户管理接口 (需登录) ===
router.get('/api/users', authMiddleware, UserController.list);
router.get('/api/users/:id', authMiddleware, UserController.detail);
router.post('/api/users', authMiddleware, UserController.add);
router.put('/api/users/:id', authMiddleware, UserController.update);
router.delete('/api/users/:id', authMiddleware, UserController.remove);

// === 校区管理接口 ===
router.get('/api/statistics/referenceDict', authMiddleware, StatisticController.referenceDict);
router.get('/api/statistics/calculate', authMiddleware, StatisticController.calculateData);

// === 校区管理接口 ===
router.get('/api/campuses', authMiddleware, CampusController.list);
router.post('/api/campuses', authMiddleware, CampusController.add);
router.put('/api/campuses/:id', authMiddleware, CampusController.update);
router.delete('/api/campuses/:id', authMiddleware, CampusController.remove);

// === 角色管理接口 ===
router.get('/api/roles/permissions', authMiddleware, RoleController.permissionList);
router.get('/api/roles/salary-schemes', authMiddleware, RoleController.salarySchemeList);
router.get('/api/roles/tax-schemes', authMiddleware, RoleController.taxSchemeList);
router.get('/api/roles', authMiddleware, RoleController.list);
router.post('/api/roles', authMiddleware, RoleController.add);
router.put('/api/roles/:id', authMiddleware, RoleController.update);
router.delete('/api/roles/:id', authMiddleware, RoleController.remove);

// === 学生管理接口 ===
router.get('/api/students', authMiddleware, StudentController.list);
router.get('/api/students/:id', authMiddleware, StudentController.detail);
router.post('/api/students', authMiddleware, StudentController.add);
router.put('/api/students/:id', authMiddleware, StudentController.update);
router.delete('/api/students/:id', authMiddleware, StudentController.remove);
router.post('/api/students/:id/records', authMiddleware, StudentController.addRecord); // 添加跟进记录

// Course 模块路由
router.get('/api/courses', authMiddleware, CourseController.list);
router.post('/api/courses', authMiddleware, CourseController.add);
router.put('/api/courses/:id', authMiddleware, CourseController.update);
router.delete('/api/courses/:id', authMiddleware, CourseController.remove);

// ====== 班级管理路由 ======
router.get('/api/classes', ClassController.list);
router.post('/api/classes', ClassController.add);
router.put('/api/classes/:id', ClassController.update);
router.delete('/api/classes/:id', ClassController.remove);

// ====== 教材管理路由 ======
router.get('/api/textbooks', authMiddleware, TextbookController.list);
router.post('/api/textbooks', authMiddleware, TextbookController.add);
router.put('/api/textbooks/:id', authMiddleware, TextbookController.update);
router.delete('/api/textbooks/:id', authMiddleware, TextbookController.remove);

// ====== 合同管理路由 ======
router.get('/api/contracts', authMiddleware, ContractController.list);
router.post('/api/contracts/preview', authMiddleware, ContractController.preview);
router.post('/api/contracts', authMiddleware, ContractController.add);
router.put('/api/contracts/:id', authMiddleware, ContractController.update);
router.delete('/api/contracts/:id', authMiddleware, ContractController.remove);

// 财务流水路由
router.get('/api/financialRecords', authMiddleware, FinancialRecordController.list);
router.post('/api/financialRecords', authMiddleware, FinancialRecordController.add);

module.exports = router;