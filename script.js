// بيانات الموقع المخزنة محلياً
let studentsData = [];
let teachersData = [];
let classesData = [];
let progressData = [];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // محاولة تحميل البيانات المخزنة محلياً
    loadLocalData();
    
    // تحديث الإحصائيات
    updateStatistics();
    
    // تحميل بيانات الطلاب الجدد
    loadNewStudents();
    
    // إضافة مستمع لنموذج إضافة طالب
    document.getElementById('add-student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewStudent();
    });
    
    // إعداد حدث تأكيد
    document.getElementById('confirm-action').addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        if (action === 'add-student') {
            confirmAddStudent();
        }
    });
});

// تحميل البيانات من التخزين المحلي
function loadLocalData() {
    // محاولة تحميل بيانات الطلاب
    const storedStudents = localStorage.getItem('quranStudents');
    if (storedStudents) {
        studentsData = JSON.parse(storedStudents);
    }
    
    // محاولة تحميل بيانات المعلمين
    const storedTeachers = localStorage.getItem('quranTeachers');
    if (storedTeachers) {
        teachersData = JSON.parse(storedTeachers);
    }
    
    // محاولة تحميل بيانات الحصص
    const storedClasses = localStorage.getItem('quranClasses');
    if (storedClasses) {
        classesData = JSON.parse(storedClasses);
    }
    
    // محاولة تحميل بيانات التقدم
    const storedProgress = localStorage.getItem('quranProgress');
    if (storedProgress) {
        progressData = JSON.parse(storedProgress);
    }
    
    // إذا لم تكن هناك بيانات محفوظة، استخدم بيانات افتراضية
    if (studentsData.length === 0) {
        loadSampleData();
    }
}

// تحميل بيانات نموذجية للاختبار
function loadSampleData() {
    studentsData = [
        { id: 1, name: "أحمد محمد", age: 12, level: "مبتدئ", teacher: "الشيخ خالد", memorized: "جزء عم", joinDate: "2023-01-15" },
        { id: 2, name: "سارة علي", age: 14, level: "متوسط", teacher: "الشيخ محمود", memorized: "الجزء 29", joinDate: "2023-02-10" },
        { id: 3, name: "محمد حسن", age: 16, level: "متقدم", teacher: "الشيخ عمر", memorized: "الجزء 28", joinDate: "2022-11-05" },
        { id: 4, name: "فاطمة عبدالله", age: 10, level: "مبتدئ", teacher: "الشيخ خالد", memorized: "بداية الجزء 30", joinDate: "2023-03-22" },
        { id: 5, name: "يوسف إبراهيم", age: 15, level: "ختم", teacher: "الشيخ محمود", memorized: "ختمة كاملة", joinDate: "2021-08-14" }
    ];
    
    teachersData = [
        { id: 1, name: "الشيخ خالد", specialization: "تجويد", studentsCount: 25, phone: "0501234567" },
        { id: 2, name: "الشيخ محمود", specialization: "حفظ", studentsCount: 30, phone: "0507654321" },
        { id: 3, name: "الشيخ عمر", specialization: "مراجعة", studentsCount: 15, phone: "0509876543" }
    ];
    
    classesData = [
        { id: 1, teacher: "الشيخ خالد", level: "مبتدئ", time: "4:00 مساءً", day: "السبت، الإثنين، الأربعاء" },
        { id: 2, teacher: "الشيخ محمود", level: "متوسط", time: "5:00 مساءً", day: "الأحد، الثلاثاء، الخميس" },
        { id: 3, teacher: "الشيخ عمر", level: "متقدم", time: "6:00 مساءً", day: "السبت، الإثنين، الأربعاء" }
    ];
    
    progressData = [
        { studentId: 1, studentName: "أحمد محمد", part: "جزء عم", status: "مكتمل", date: "2023-04-10" },
        { studentId: 2, studentName: "سارة علي", part: "الجزء 29", status: "قيد المراجعة", date: "2023-04-15" },
        { studentId: 3, studentName: "محمد حسن", part: "الجزء 28", status: "مكتمل", date: "2023-04-05" },
        { studentId: 4, studentName: "فاطمة عبدالله", part: "بداية الجزء 30", status: "قيد الحفظ", date: "2023-04-12" }
    ];
    
    // حفظ البيانات محلياً
    saveLocalData();
}

// حفظ البيانات محلياً
function saveLocalData() {
    localStorage.setItem('quranStudents', JSON.stringify(studentsData));
    localStorage.setItem('quranTeachers', JSON.stringify(teachersData));
    localStorage.setItem('quranClasses', JSON.stringify(classesData));
    localStorage.setItem('quranProgress', JSON.stringify(progressData));
}

// تحديث الإحصائيات
function updateStatistics() {
    document.getElementById('students-count').textContent = studentsData.length;
    document.getElementById('teachers-count').textContent = teachersData.length;
    document.getElementById('classes-count').textContent = classesData.length;
    
    // حساب إجمالي الأجزاء المحفوظة
    const totalParts = progressData.filter(item => item.status === "مكتمل").length;
    document.getElementById('parts-count').textContent = totalParts;
}

// تحميل الطلاب الجدد
function loadNewStudents() {
    const tableBody = document.getElementById('new-students-table');
    tableBody.innerHTML = '';
    
    // عرض آخر 5 طلاب مسجلين
    const recentStudents = [...studentsData].reverse().slice(0, 5);
    
    recentStudents.forEach(student => {
        const row = document.createElement('tr');
        
        // تحديد لون المستوى
        let levelClass = '';
        switch(student.level) {
            case 'مبتدئ': levelClass = 'level-beginner'; break;
            case 'متوسط': levelClass = 'level-intermediate'; break;
            case 'متقدم': levelClass = 'level-advanced'; break;
            case 'ختم': levelClass = 'level-master'; break;
        }
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td class="${levelClass}">${student.level}</td>
            <td>${student.teacher}</td>
            <td>${student.memorized}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// إضافة طالب جديد
function addNewStudent() {
    const name = document.getElementById('student-name').value;
    const age = document.getElementById('student-age').value;
    const level = document.getElementById('student-level').value;
    const teacher = document.getElementById('student-teacher').value;
    const memorized = document.getElementById('student-memorized').value;
    
    // إنشاء معرف فريد للطالب
    const newId = studentsData.length > 0 ? Math.max(...studentsData.map(s => s.id)) + 1 : 1;
    
    // إنشاء كائن الطالب الجديد
    const newStudent = {
        id: newId,
        name: name,
        age: parseInt(age),
        level: level,
        teacher: teacher,
        memorized: memorized,
        joinDate: new Date().toISOString().split('T')[0] // تاريخ اليوم
    };
    
    // عرض نموذج التأكيد
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <p>هل تريد إضافة الطالب الجديد؟</p>
        <div class="alert alert-info">
            <strong>الاسم:</strong> ${name}<br>
            <strong>العمر:</strong> ${age}<br>
            <strong>المستوى:</strong> ${level}<br>
            <strong>المعلم:</strong> ${teacher}<br>
            <strong>الحفظ الحالي:</strong> ${memorized}
        </div>
    `;
    
    // تعيين الإجراء للتأكيد
    document.getElementById('confirm-action').setAttribute('data-action', 'add-student');
    
    // حفظ بيانات الطالب المؤقتة
    document.getElementById('confirm-action').dataset.tempStudent = JSON.stringify(newStudent);
    
    // عرض النموذج
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// تأكيد إضافة الطالب
function confirmAddStudent() {
    const tempStudent = JSON.parse(document.getElementById('confirm-action').dataset.tempStudent);
    
    // إضافة الطالب إلى البيانات
    studentsData.push(tempStudent);
    
    // إضافة سجل التقدم
    const newProgress = {
        studentId: tempStudent.id,
        studentName: tempStudent.name,
        part: tempStudent.memorized,
        status: "قيد الحفظ",
        date: new Date().toISOString().split('T')[0]
    };
    
    progressData.push(newProgress);
    
    // حفظ البيانات محلياً
    saveLocalData();
    
    // تحديث الواجهة
    updateStatistics();
    loadNewStudents();
    
    // إعادة تعيين النموذج
    document.getElementById('add-student-form').reset();
    
    // إغلاق النموذج
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    modal.hide();
    
    // عرض رسالة نجاح
    showAlert('تم إضافة الطالب بنجاح!', 'success');
}

// عرض رسالة تنبيه
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // إضافة التنبيه أعلى الصفحة
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // إزالة التنبيه تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// مزامنة مع Excel (وظيفة أساسية)
function syncWithExcel() {
    showAlert('يتم الآن مزامنة البيانات مع ملف Excel...', 'info');
    // سيتم تفصيل هذه الوظيفة في excel-interface.js
}

// تصدير البيانات إلى Excel
function exportToExcel() {
    showAlert('جاري تصدير البيانات إلى ملف Excel...', 'info');
    // سيتم تفصيل هذه الوظيفة في excel-interface.js
}

// تنزيل نموذج Excel
function downloadTemplate() {
    showAlert('جاري تحميل نموذج Excel...', 'info');
    // سيتم تفصيل هذه الوظيفة في excel-interface.js
}

// رفع ملف Excel
function uploadExcelFile() {
    const fileInput = document.getElementById('excel-file');
    if (fileInput.files.length === 0) {
        showAlert('يرجى اختيار ملف Excel أولاً', 'warning');
        return;
    }
    
    showAlert('جاري رفع ومعالجة ملف Excel...', 'info');
    // سيتم تفصيل هذه الوظيفة في excel-interface.js
}