import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { UserWorkSchedule } from '../model/user.work.schedule';
import { ShiftType } from '../model/enum.shift.type';

export interface MockEmployeeData {
    code: string;
    fullName: string;
    group: string;
    grade: string;
    allowanceLevel: string;
    shift: string;
    timeOT: number;
    workSchedule: {
        date: string;
        a: number;
        b: number;
        c: number;
        adm: number;
        groupA: number;
        groupB: number;
    }[];
}

export interface MockDataResponse {
    employees: { [key: string]: MockEmployeeData };
}

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    private mockDataCache: MockDataResponse | null = null;

    constructor(private http: HttpClient) { }

    // Load mock data from JSON file
    private loadMockData(): Observable<MockDataResponse> {
        if (this.mockDataCache) {
            return of(this.mockDataCache);
        }

        return this.http.get<MockDataResponse>('/assets/mock-data/employee-shift-data.json')
            .pipe(
                map(data => {
                    this.mockDataCache = data;
                    return data;
                })
            );
    }

    // Get employee by code
    getEmployeeByCode(code: string): Observable<MockEmployeeData | null> {
        return this.loadMockData().pipe(
            map(data => {
                const employee = data.employees[code];
                return employee || null;
            })
        );
    }

    // Search employees by code or name
    searchEmployees(searchTerm: string): Observable<MockEmployeeData[]> {
        return this.loadMockData().pipe(
            map(data => {
                const employees = Object.values(data.employees);
                const term = searchTerm.toLowerCase();

                return employees.filter(emp =>
                    emp.code.toLowerCase().includes(term) ||
                    emp.fullName.toLowerCase().includes(term)
                );
            })
        );
    }

    // Convert mock data to UserWorkSchedule format
    convertToUserWorkSchedule(employee: MockEmployeeData, year: number, month: number): UserWorkSchedule {
        // Filter schedules for the specified month/year
        const filteredSchedules = employee.workSchedule
            .filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month - 1;
            })
            .map(schedule => ({
                id: 0,
                date: new Date(schedule.date),
                a: schedule.a,
                b: schedule.b,
                c: schedule.c,
                adm: schedule.adm,
                groupA: schedule.groupA,
                groupB: schedule.groupB
            }));

        return {
            code: employee.code,
            fullName: employee.fullName,
            group: employee.group,
            grade: employee.grade,
            allowanceLevel: employee.allowanceLevel,
            shift: employee.shift,
            timeOT: employee.timeOT,
            workSchedule: filteredSchedules
        };
    }

    // Convert numeric shift values to ShiftType enum
    private convertShiftValue(value: number): ShiftType {
        switch (value) {
            case 1: return ShiftType.N; // Day shift
            case 2: return ShiftType.Đ; // Night shift  
            case 6: return ShiftType.P; // Off (using vacation)
            case 33: return ShiftType._; // Empty/undefined
            default: return ShiftType.N; // Default to day shift
        }
    }

    // Get all employees list
    getAllEmployees(): Observable<MockEmployeeData[]> {
        return this.loadMockData().pipe(
            map(data => Object.values(data.employees))
        );
    }
}
