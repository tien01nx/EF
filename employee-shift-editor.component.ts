import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTagModule } from "ng-zorro-antd/tag";

import { BaseComponent } from "../../../base/base/base.component";
import { ShiftType } from "../../../model/enum.shift.type";
import { HistoryShiftChange } from "../../../model/history.shift.change";
import { HistoryShiftChangeService } from "../../../service/history-shift-change.service";
import { HrBtypeShift } from "../../../model/hr.btype.shift";
import { UserWorkSchedule } from "../../../model/user.work.schedule";
import { ApiResponse } from "../../../responses/api.response";
import { MockDataService, MockEmployeeData } from "../../../service/mock-data.service";
import { HttpErrorResponse } from "@angular/common/http";

interface EmployeeShiftRecord {
    id: number;
    checked: boolean;
    date: Date;
    fullName: string;
    group: string;
    shift: string;
    shiftType: number;
    originalShiftType: number;
    isModified: boolean;
}

@Component({
    selector: "app-employee-shift-editor",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzCheckboxModule,
        NzMessageModule,
        NzCardModule,
        NzGridModule,
        NzSpinModule,
        NzIconModule,
        NzTagModule,
    ],
    templateUrl: "./employee-shift-editor.component.html",
    styleUrls: ["./employee-shift-editor.component.css"],
})
export class EmployeeShiftEditorComponent
    extends BaseComponent
    implements OnInit, OnChanges {
    @Input() selectedMonth!: number;

    // Search properties
    employeeCode: string = "";
    override isLoading: boolean = false;
    currentYear: number = new Date().getFullYear();
    employeeData: any | null = null;
    shiftRecords: EmployeeShiftRecord[] = [];
    override historyShiftService: HistoryShiftChangeService;

    // Shift type options
    shiftTypeOptions = [
        { label: "Kíp ngày", value: ShiftType.N },
        { label: "Kíp đêm", value: ShiftType.Đ },
        { label: "Ca đêm", value: ShiftType.CĐ },
        { label: "Hành chính", value: ShiftType.HC },
        { label: "Con nhỏ", value: ShiftType._4H },
        { label: "Phép cả ngày", value: ShiftType.P },
        { label: "Phép nửa ngày trước", value: ShiftType.P1 },
        { label: "Phép nửa ngày sau", value: ShiftType.P2 },
        { label: "Không lương cả ngày", value: ShiftType.KL },
        { label: "Không lương nửa ngày trước", value: ShiftType.KL1 },
        { label: "Không lương nửa ngày sau", value: ShiftType.KL2 },
        { label: "Dưỡng sức thai sản", value: ShiftType.CONV_TS },
        { label: "Dưỡng sức ốm", value: ShiftType.CONV_O },
        { label: "Khám thai", value: ShiftType.KT },
        { label: "Ốm normal", value: ShiftType.ON1 },
        { label: "Con ốm", value: ShiftType.CO2 },
        { label: "Ốm dài", value: ShiftType.OM },
        { label: "Hút thai", value: ShiftType.HT },
        { label: "Tránh thai", value: ShiftType.TT1 },
        { label: "Đặc biệt", value: ShiftType.SP },
        { label: "Nghỉ công ty", value: ShiftType.CVN },
        { label: "Làm thêm ngày nghỉ", value: ShiftType.OT },
        { label: "Nghỉ dừng ca", value: ShiftType.SH },
        { label: "Thai sản nữ", value: ShiftType.TS },
        { label: "Nam nghỉ vợ sinh", value: ShiftType.VS },
        { label: "Đi học", value: ShiftType.CT },
        { label: "Tạm dừng hợp đồng", value: ShiftType.SUS },
        { label: "Tai nạn lao động", value: ShiftType.TNLD },
        { label: "Nghỉ bù OT", value: ShiftType.NB },
        { label: "Trực đêm cả ngày", value: ShiftType.NP },
        { label: "Trực đêm chiều", value: ShiftType.NP2 },
        { label: "Swing", value: ShiftType.SW },
    ];

    ngOnInit(): void {
        // Initialize component
        this.loadEmployeeShiftData();
    }

    constructor(
        private mockDataService: MockDataService,
        historyShiftService: HistoryShiftChangeService
    ) {
        super();
        this.historyShiftService = historyShiftService;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["selectedMonth"] && this.employeeData) {
            this.loadEmployeeShiftData();
        }
    }

    // Search for employee by code using mock data
    searchEmployee(): void {
        if (!this.employeeCode.trim()) {
            this.showMessage('warning', "Vui lòng nhập mã nhân viên");
            return;
        }

        this.isLoading = true;

        // Use mock data service to find employee
        this.mockDataService.getEmployeeByCode(this.employeeCode).subscribe({
            next: (employee: MockEmployeeData | null) => {
                if (employee) {
                    this.loadEmployeeFromMockData(employee);
                    this.showMessage('success', `Đã tìm thấy nhân viên: ${employee.fullName}`);
                } else {
                    this.showMessage('error', "Không tìm thấy nhân viên với mã: " + this.employeeCode);
                    this.clearEmployeeData();
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.showMessage('error', "Lỗi khi tải dữ liệu: " + error.message);
                this.clearEmployeeData();
                this.isLoading = false;
            },
        });
    }

    // Load employee data from mock data
    private loadEmployeeFromMockData(employee: MockEmployeeData): void {
        const year = new Date().getFullYear();
        this.employeeData = this.mockDataService.convertToUserWorkSchedule(employee, year, this.selectedMonth);
        this.loadEmployeeShiftData();
    }

    // Load employee shift data for the month
    private loadEmployeeShiftData(): void {
        if (!this.employeeData) return;

        this.shiftRecords = [];
        const workSchedule = this.employeeData.workSchedule || [];

        // Get current month dates
        const year = new Date().getFullYear();
        const month = this.selectedMonth;
        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month - 1, day);

            // Find schedule for this day
            const scheduleForDay = workSchedule.find((schedule: any) => {
                const scheduleDate = new Date(schedule.date);
                return (
                    scheduleDate.getDate() === day &&
                    scheduleDate.getMonth() === month - 1 &&
                    scheduleDate.getFullYear() === year
                );
            });

            let currentShiftType = ShiftType.N; // Default to day shift
            if (scheduleForDay) {
                // scheduleForDay is from workSchedule array which has shiftType property
                currentShiftType = scheduleForDay.shiftType || ShiftType.N;
            }

            const record: EmployeeShiftRecord = {
                id: day,
                checked: false,
                date: currentDate,
                fullName: this.employeeData.fullName || '',
                group: this.employeeData.group || '',
                shift: this.employeeData.shift || '',
                shiftType: currentShiftType,
                originalShiftType: currentShiftType,
                isModified: false,
            };

            this.shiftRecords.push(record);
        }
    }

    // Handle shift type change
    onShiftTypeChange(record: EmployeeShiftRecord): void {
        record.isModified = record.shiftType !== record.originalShiftType;
        record.checked = record.isModified;
    }

    // Handle checkbox change
    onCheckboxChange(record: EmployeeShiftRecord): void {
        if (!record.checked) {
            // If unchecked, reset to original value
            record.shiftType = record.originalShiftType;
            record.isModified = false;
        }
    }

    // Select all modified records
    selectAllModified(): void {
        this.shiftRecords.forEach(record => {
            if (record.isModified) {
                record.checked = true;
            }
        });
    }

    // Clear selection
    clearSelection(): void {
        this.shiftRecords.forEach(record => {
            record.checked = false;
            if (record.isModified) {
                record.shiftType = record.originalShiftType;
                record.isModified = false;
            }
        });
    }

    // Save changes
    saveChanges(): void {
        const changedRecords = this.shiftRecords.filter(record => record.checked && record.isModified);

        if (changedRecords.length === 0) {
            this.showMessage('warning', "Không có thay đổi nào được chọn để lưu");
            return;
        }

        // Prepare history shift change records
        const historyRecords: HistoryShiftChange[] = changedRecords.map(record => ({
            id: 0, // Will be set by API
            code: this.employeeData!.code,
            fullName: this.employeeData!.fullName,
            group: this.employeeData!.group,
            groupNew: this.employeeData!.group,
            shift: this.employeeData!.shift,
            shiftNew: this.employeeData!.shift,
            grade: this.employeeData!.grade,
            workingStartDate: record.date,
            workingEndDate: record.date,
            workDays: 1,
            shiftType: record.shiftType,
            workTime: 8, // Default work time
            reason: `Thay đổi loại ca từ ${this.getShiftTypeName(record.originalShiftType)} thành ${this.getShiftTypeName(record.shiftType)}`,
            createDate: new Date(),
            createBy: "System", // Should be current user
        }));

        this.isLoading = true;

        // Call API to save changes (assuming there's a service method for this)
        this.saveShiftChanges(historyRecords)
            .then(() => {
                this.showMessage('success', `Đã lưu thành công ${changedRecords.length} thay đổi`);
                // Update original values to prevent re-saving
                changedRecords.forEach(record => {
                    record.originalShiftType = record.shiftType;
                    record.isModified = false;
                    record.checked = false;
                });
                this.isLoading = false;
            })
            .catch((error) => {
                this.showMessage('error', "Lỗi khi lưu thay đổi: " + error.message);
                this.isLoading = false;
            });
    }

    // Save shift changes (API call)
    private saveShiftChanges(records: HistoryShiftChange[]): Promise<void> {
        return new Promise((resolve, reject) => {
            // Create array of promises for each record
            const savePromises = records.map(record =>
                this.historyShiftService.Create(record).toPromise()
            );

            // Execute all saves
            Promise.all(savePromises)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    // Get shift type name by value
    private getShiftTypeName(shiftTypeValue: number): string {
        const option = this.shiftTypeOptions.find(opt => opt.value === shiftTypeValue);
        return option ? option.label : "Không xác định";
    }

    // Clear employee data
    private clearEmployeeData(): void {
        this.employeeData = null;
        this.shiftRecords = [];
    }

    // Get shift type name for display
    getShiftTypeLabel(value: number): string {
        return this.getShiftTypeName(value);
    }

    // Format date for display
    override formatDate(date: Date): string {
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    // Get modified count
    get modifiedCount(): number {
        return this.shiftRecords.filter(record => record.isModified).length;
    }

    // Get selected count
    get selectedCount(): number {
        return this.shiftRecords.filter(record => record.checked).length;
    }
}
