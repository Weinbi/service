-- 角色表
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL, -- 如：管理员, 课程顾问, 教师, 财务
    role_description VARCHAR(255), -- 角色描述
    permissions JSON NOT NULL, -- 存储权限标识符 存储格式: ["user:manage", "finance:manage"]
    salary_scheme JSON, -- 薪资方案 存储格式: [{type:"基本工资", name:"月薪", "reference_code": null, "value": 3000, "suffix": "元"}]
    tax_scheme JSON, -- 税务方案 存储格式: [{type:"法定代扣代缴", name:"养老保险", "reference_code": "gross_salary", "value": 8, "suffix": "%"}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(50),
  phone VARCHAR(20),
  bank_name VARCHAR(50),
  bank_account VARCHAR(50),
  role_id INT,
  tax_info json, -- 社保缴费 存储格式: {"additional_deduction": 2000, "current_base": 4500, "salary_review": { "last_year_total": 116000, "last_year_month": 12, "monthly_avg": 9666.67 }}
  status TINYINT DEFAULT 1, -- 1:在职, 0:离职
  join_date DATE, -- 入职日期
  resignation_date DATE, -- 离职日期
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 校区表
CREATE TABLE campuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE, -- 如：海淀校区
    address VARCHAR(255),
    status VARCHAR(50) DEFAULT '营业中', -- 营业中、已停业
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学生表
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    parent_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT '新线索', -- 核心状态：新线索、已试听、已转化、已流失
    consultant_id INT, -- 负责的课程顾问
    records JSON, -- 跟进记录：[{"content": "已试听 六年级英语", "operator": "real_name", "created_at": "2026-02-24 12:40:22"}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 教材表
CREATE TABLE textbooks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_name VARCHAR(100) NOT NULL UNIQUE,
    reserved_quantity INT DEFAULT 0, -- 合同已定但未领取的数量
    stock INT DEFAULT 0, -- 实物总库存
    unit_price DECIMAL(10, 2),
    campus_id INT,
    distribution_records JSON -- 存储结构 [{"operator_id": 1, "real_name": "操作员", "type": "教材领取", "student_info": [], "quantity": 1, "created_at": "2026-03-01"}]
);

-- 课程种类(模板)
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) UNIQUE,
    class_period INT, -- 每节课时长（分钟）
    session_unit INT, -- 每次培训课时
    unit_price DECIMAL(10, 2), -- 课时单价
    textbook_config JSON, -- 教材配置：[{"textbook_id": 101}]
    discount_scheme JSON, -- 折扣方案：[{"name": "...", "value": 0, "suffix": "元\%", "condition": { "end_date": "2026-03-01", "min_hours": 40, "student_status": "新线索" }}]
    group_scheme JSON, -- 团购方案：[{"name": "线上团购\线下团购", "value": 0, "suffix": "元\%"}]
    performance_scheme JSON, -- 绩效方案：[{"type": "新生成交\老生续费\课时消耗\退费扣除", "role_name": "教师\课程顾问", "value": 0, "suffix": "元\%"}]
    refund_scheme JSON, -- 退费方案：[{"name": "转账手续费", "reference_code": "contract_balance", "value": 0, "suffix": "%"}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 班级表 (实例)
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    campus_id INT,
    teacher_id INT,
    class_name VARCHAR(100) UNIQUE,
    max_capacity INT,
    current_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT '开课中',
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT
);

-- 报名合同表 (记录资金流入)
CREATE TABLE contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    student_snapshot JSON, -- 存储格式: {"name": "张三", "parent_phone": "..."}
    course_snapshot JSON, -- 存储格式: {"course_id": 1, "course_name": "初级英语", "class_period": 120, "unit_price": 120 }
    purchased_hours INT DEFAULT 0, -- 购买课时
    textbook_info JSON, -- 存储格式: [{"textbook_id": 101, "book_name": "教材A", "quantity": 1, "unit_price": 50}]
    discount_info JSON, -- 存储格式: [{"name": "...", "value": 0, "suffix": "元\%", "amount": 0}]
    group_info JSON, -- 团购信息 [{"name": "线上团购\线下团购", "value": 0, "suffix": "元\%", "amount": 0, "student_info": [{ "id": 1, "name": "张三"}], "verify_code":"xxxx"}]
    total_due DECIMAL(10, 2), -- 实付金额
    consultant_id INT, -- 所属课程顾问ID
    campus_id INT,
    remark TEXT,
    account_balance DECIMAL(10, 2) DEFAULT 0.00, -- 账户余额
    status VARCHAR(50) DEFAULT '已签约', -- 合同状态: 已签约、已收款、已退费
    payment_method VARCHAR(200), -- 支付方式
    refund_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT
);

-- 财务流水表
CREATE TABLE financial_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    serial_no VARCHAR(50) UNIQUE,
    campus_id INT NOT NULL,
    trade_type VARCHAR(50) NOT NULL, -- 收入、支出、退费
    category VARCHAR(50) NOT NULL, -- 学费、教材费、薪资、房租、水费、电费、其他
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(200), -- 支付方式
    operator_id INT,
    contract_id INT,
    refund_id INT,
    remark TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 绩效记录表
CREATE TABLE performance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    user_id INT NOT NULL, -- 关联人ID (顾问或教师)
    perf_type varchar(50) NOT NULL, -- 绩效类型: '新生成交', '老生续费', '课时消耗', '退费扣除'
    amount DECIMAL(10, 2) NOT NULL, -- 绩效金额 (正数为增加，负数为扣除)
    
    -- === 业务关联 ===
    contract_id INT,
    attendance_id INT,
    refund_id INT,
  
    calc_snapshot JSON NOT NULL, -- 计算逻辑快照: 示例: {"name": "课程顾问提成", "value": 0, "suffix": "元\%"} 
    settlement_id INT DEFAULT NULL, -- 关联的薪酬结算单ID (已结算则不为NULL)
    status varchar(20) DEFAULT '待结算', -- 绩效记录状态: '待结算', '已结算'
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学生报名课程详情表
CREATE TABLE student_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    remaining_hours INT DEFAULT 0, -- 剩余课时
    total_hours INT DEFAULT 0, -- 总课时
    average_unit_price DECIMAL(10, 2) DEFAULT 0.00, -- 平均单价
    status VARCHAR(50) DEFAULT '正常',
    join_date DATE, -- 入班时间
    UNIQUE KEY (student_id, class_id), -- 防止重复报名同一门课
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 教室表
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(50) UNIQUE,
    capacity INT,
    campus_id INT,
    FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT
);

-- 排课记录表
CREATE TABLE class_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    teacher_id INT,
    room_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(50) DEFAULT '已排课',
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 学生考勤签到表 (课消的唯一凭证)
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    records json NOT NULL, -- 存储格式: [{"student_id": 1,"student_name": "张三", "status": "出勤\请假\补课", "consume_hours": 1}]
    remark VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 课时变动流水表
CREATE TABLE hours_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- 变动类型: '报名充值', '正常消课', '补课消课', '退费扣课', '调课扣课', '调课加课'
    change_hours int NOT NULL,
    operator_id INT,
    remark VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 试听记录表
CREATE TABLE trial_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT, 
    schedule_id INT, 
    trial_date DATE,
    is_attended BOOLEAN DEFAULT FALSE,
    feedback TEXT
);

-- 退费记录表
CREATE TABLE refunds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT NOT NULL,
    refund_info JSON, -- 存储格式: [{"name": "转账手续费", "reference_code": "contract_balance", "value": 0, "suffix": "元/%"}]
    refund_amount DECIMAL(10, 2) NOT NULL,
    total_deducted_amount DECIMAL(10, 2) DEFAULT 0.00,
    hours_to_deduct INT NOT NULL,
    payment_method VARCHAR(200), -- 支付方式
    reason TEXT,
    status VARCHAR(50) DEFAULT '待审核',
    applicant_id INT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    auditor_id INT,
    audited_at TIMESTAMP,
    paid_at DATETIME,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- 工资结算表
CREATE TABLE payroll_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    serial_no VARCHAR(50) UNIQUE NOT NULL,
    campus_id INT NOT NULL,
    user_id INT NOT NULL,
    billing_cycle VARCHAR(7) NOT NULL, 
    settlement_date DATE NOT NULL, 
    total_payable DECIMAL(10, 2) NOT NULL, 
    total_deduction DECIMAL(10, 2) DEFAULT 0.00, 
    actual_payout DECIMAL(10, 2) NOT NULL, 
    salary_details JSON NOT NULL, 
    config_snapshot JSON, 
    status VARCHAR(50) DEFAULT '待确认',
    payment_date DATE, 
    operator_id INT, 
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_billing_cycle ON payroll_records(billing_cycle);