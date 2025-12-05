// مكتبة SheetJS متاحة كـ XLSX

// تنزيل نموذج Excel فارغ
function downloadTemplate() {
    // إنشاء مصنف Excel
    const wb = XLSX.utils.book_new();
    
    // ورقة بيانات الطلاب
    const wsStudents = XLSX.utils.json_to_sheet([
        { "الاسم": "أحمد محمد", "العمر": 12, "المستوى": "مبتدئ", "المعلم": "الشيخ خالد", "الحفظ_الحالي": "جزء عم", "تاريخ_الانضمام": "2023-01-15" },
        { "الاسم": "سارة علي", "العمر": 14, "المستوى": "متوسط", "المعلم": "الشيخ محمود", "الحفظ_الحالي": "الجزء 29", "تاريخ_الانضمام": "2023-02-10" }
    ]);
    XLSX.utils.book_append_sheet(wb, wsStudents, "الطلاب");
    
    // ورقة بيانات المعلمين
    const wsTeachers = XLSX.utils.json_to_sheet([
        { "الاسم": "الشيخ خالد", "التخصص": "تجويد", "عدد_الطلاب": 25, "الهاتف": "0501234567" },
        { "الاسم": "الشيخ محمود", "التخصص": "حفظ", "عدد_الطلاب": 30, "الهاتف": "0507654321" }
    ]);
    XLSX.utils.book_append_sheet(wb, wsTeachers, "المعلمين");
    
    // ورقة بيانات الحصص
    const wsClasses = XLSX.utils.json_to_sheet([
        { "المعلم": "الشيخ خالد", "المستوى": "مبتدئ", "الوقت": "4:00 مساءً", "الأيام": "السبت، الإثنين، الأربعاء" },
        { "المعلم": "الشيخ محمود", "المستوى": "متوسط", "الوقت": "5:00 مساءً", "الأيام": "الأحد، الثلاثاء، الخميس" }
    ]);
    XLSX.utils.book_append_sheet(wb, wsClasses, "الحصص");
    
    // ورقة بيانات التقدم
    const wsProgress = XLSX.utils.json_to_sheet([
        { "اسم_الطالب": "أحمد محمد", "الجزء": "جزء عم", "الحالة": "مكتمل", "التاريخ": "2023-04-10" },
        { "اسم_الطالب": "سارة علي", "الجزء": "الجزء 29", "الحالة": "قيد المراجعة", "التاريخ": "2023-04-15" }
    ]);
    XLSX.utils.book_append_sheet(wb, wsProgress, "التقدم");
    
    // تنزيل الملف
    XLSX.writeFile(wb, "نموذج_مؤسسة_تحفيظ_القرآن.xlsx");
    showAlert('تم تحميل النموذج بنجاح!', 'success');
}

// تصدير البيانات الحالية إلى Excel
function exportToExcel() {
    // إنشاء مصنف Excel
    const wb = XLSX.utils.book_new();
    
    // تصدير بيانات الطلاب
    const wsStudents = XLSX.utils.json_to_sheet(studentsData.map(student => ({
        "الاسم": student.name,
        "العمر": student.age,
        "المستوى": student.level,
        "المعلم": student.teacher,
        "الحفظ_الحالي": student.memorized,
        "تاريخ_الانضمام": student.joinDate
    })));
    XLSX.utils.book_append_sheet(wb, wsStudents, "الطلاب");
    
    // تصدير بيانات المعلمين
    const wsTeachers = XLSX.utils.json_to_sheet(teachersData.map(teacher => ({
        "الاسم": teacher.name,
        "التخصص": teacher.specialization,
        "عدد_الطلاب": teacher.studentsCount,
        "الهاتف": teacher.phone
    })));
    XLSX.utils.book_append_sheet(wb, wsTeachers, "المعلمين");
    
    // تصدير بيانات الحصص
    const wsClasses = XLSX.utils.json_to_sheet(classesData.map(cls => ({
        "المعلم": cls.teacher,
        "المستوى": cls.level,
        "الوقت": cls.time,
        "الأيام": cls.day
    })));
    XLSX.utils.book_append_sheet(wb, wsClasses, "الحصص");
    
    // تصدير بيانات التقدم
    const wsProgress = XLSX.utils.json_to_sheet(progressData.map(progress => ({
        "اسم_الطالب": progress.studentName,
        "الجزء": progress.part,
        "الحالة": progress.status,
        "التاريخ": progress.date
    })));
    XLSX.utils.book_append_sheet(wb, wsProgress, "التقدم");
    
    // تنزيل الملف
    XLSX.writeFile(wb, `بيانات_مؤسسة_تحفيظ_القرآن_${new Date().toISOString().split('T')[0]}.xlsx`);
    showAlert('تم تصدير البيانات بنجاح!', 'success');
}

// معالجة ملف Excel المرفوع
function uploadExcelFile() {
    const fileInput = document.getElementById('excel-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('يرجى اختيار ملف Excel أولاً', 'warning');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // معالجة كل ورقة في الملف
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // تحديث البيانات حسب اسم الورقة
                switch(sheetName) {
                    case 'الطلاب':
                        processStudentsData(jsonData);
                        break;
                    case 'المعلمين':
                        processTeachersData(jsonData);
                        break;
                    case 'الحصص':
                        processClassesData(jsonData);
                        break;
                    case 'التقدم':
                        processProgressData(jsonData);
                        break;
                    default:
                        console.log(`ورقة غير معروفة: ${sheetName}`);
                }
            });
            
            // حفظ البيانات محلياً
            saveLocalData();
            
            // تحديث الواجهة
            updateStatistics();
            loadNewStudents();
            
            showAlert('تم تحديث البيانات بنجاح من ملف Excel!', 'success');
            
        } catch (error) {
            console.error('خطأ في معالجة ملف Excel:', error);
            showAlert('حدث خطأ في معالجة ملف Excel. يرجى التأكد من تنسيق الملف', 'danger');
        }
    };
    
    reader.onerror = function() {
        showAlert('حدث خطأ في قراءة الملف', 'danger');
    };
    
    reader.readAsArrayBuffer(file);
}

// معالجة بيانات الطلاب من Excel
function processStudentsData(jsonData) {
    // تحويل بيانات Excel إلى تنسيق التطبيق
    studentsData = jsonData.map((item, index) => ({
        id: index + 1,
        name: item["الاسم"] || item["اسم"] || "",
        age: item["العمر"] || 0,
        level: item["المستوى"] || "مبتدئ",
        teacher: item["المعلم"] || "",
        memorized: item["الحفظ_الحالي"] || item["الحفظ الحالي"] || "",
        joinDate: item["تاريخ_الانضمام"] || item["تاريخ الانضمام"] || new Date().toISOString().split('T')[0]
    }));
}

// معالجة بيانات المعلمين من Excel
function processTeachersData(jsonData) {
    teachersData = jsonData.map((item, index) => ({
        id: index + 1,
        name: item["الاسم"] || "",
        specialization: item["التخصص"] || "حفظ",
        studentsCount: item["عدد_الطلاب"] || item["عدد الطلاب"] || 0,
        phone: item["الهاتف"] || ""
    }));
}

// معالجة بيانات الحصص من Excel
function processClassesData(jsonData) {
    classesData = jsonData.map((item, index) => ({
        id: index + 1,
        teacher: item["المعلم"] || "",
        level: item["المستوى"] || "مبتدئ",
        time: item["الوقت"] || "",
        day: item["الأيام"] || ""
    }));
}

// معالجة بيانات التقدم من Excel
function processProgressData(jsonData) {
    progressData = jsonData.map(item => {
        // البحث عن معرف الطالب من اسمه
        const student = studentsData.find(s => s.name === (item["اسم_الطالب"] || item["اسم الطالب"] || ""));
        
        return {
            studentId: student ? student.id : 0,
            studentName: item["اسم_الطالب"] || item["اسم الطالب"] || "",
            part: item["الجزء"] || "",
            status: item["الحالة"] || "قيد الحفظ",
            date: item["التاريخ"] || new Date().toISOString().split('T')[0]
        };
    }).filter(item => item.studentName); // إزالة العناصر الفارغة
}

// مزامنة كاملة مع ملفات Excel
function syncWithExcel() {
    // في حالة حقيقية، قد يتصل هذا بالخادم للحصول على أحدث بيانات Excel
    // هنا سنقوم بعرض خيارات المزامنة
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h6>خيارات المزامنة مع Excel</h6>
        <div class="list-group">
            <button class="list-group-item list-group-item-action" onclick="exportToExcel()">
                <i class="fas fa-download"></i> تصدير البيانات الحالية إلى Excel
            </button>
            <button class="list-group-item list-group-item-action" onclick="downloadTemplate()">
                <i class="fas fa-file-download"></i> تحميل نموذج Excel فارغ
            </button>
            <div class="list-group-item">
                <label for="sync-excel-file" class="form-label">رفع ملف Excel لتحديث البيانات</label>
                <input class="form-control" type="file" id="sync-excel-file" accept=".xlsx, .xls">
                <button class="btn btn-primary mt-2 w-100" onclick="uploadSyncFile()">
                    <i class="fas fa-upload"></i> رفع وتحديث
                </button>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// رفع ملف للمزامنة
function uploadSyncFile() {
    const fileInput = document.getElementById('sync-excel-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('يرجى اختيار ملف Excel أولاً', 'warning');
        return;
    }
    
    uploadExcelFile();
    
    // إغلاق النموذج
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    modal.hide();
}