export interface Member {
    id?: number;
    name: string;
    father_husband_name: string;
    gender: string;
    cnic_number: string;
    date_of_birth: string;
    date_of_issue: string;
    date_of_expiry: string;
    cnic_front_image?: number[] | null;
    cnic_back_image?: number[] | null;
}
