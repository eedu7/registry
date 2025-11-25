import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { Member } from "@/types/members";

// Fetch a single member by their CNIC number.
export async function useGetMemberByCnic(cnicNumber: string) {
    return useQuery({
        queryKey: ["get_member_by_cnic", cnicNumber],
        queryFn: async () => {
            try {
                return await invoke("get_member_by_cnic", {
                    cnicNumber,
                });
            } catch (error) {
                throw new Error(`Error: 'Fetching member by cnic': ${error}`);
            }
        },
    });
}

// Fetch a single member by their id.
export async function useGetMemberById(cnicNumber: string) {
    return useQuery({
        queryKey: ["get_member_by_cnic", cnicNumber],
        queryFn: async () => {
            try {
                return await invoke("get_member_by_id", {
                    cnicNumber,
                });
            } catch (error) {
                throw new Error(`Error: 'Fetching member by id': ${error}`);
            }
        },
    });
}

// Fetch all members from the database.
export async function useGetMembers() {
    return useQuery({
        queryKey: ["get_all_members", "members"],
        queryFn: async () => {
            try {
                return await invoke<Member[]>("get_all_members");
            } catch (error) {
                throw new Error(`Error: 'Fetching members': ${error}`);
            }
        },
    });
}

// Create a new member using provided form data.
export async function useCreateMember() {
    return useMutation({
        mutationKey: ["add_member", "new-member"],
        mutationFn: async (formData: FormData) => {
            try {
                await invoke("add_member", {
                    member: formData,
                });
            } catch (error) {
                throw new Error(`Error: 'Inserting member': ${error}`);
            }
        },
    });
}

// Update an existing member using their ID.
export async function useUpdateMember(id: number) {
    return useMutation({
        mutationKey: ["update_member", "update-member", id],
        mutationFn: async (formData: FormData) => {
            try {
                await invoke("update_member", {
                    id,
                    member: formData,
                });
            } catch (error) {
                throw new Error(`Error: 'Updating member': ${error}`);
            }
        },
    });
}

// Delete a member by their ID.
export async function useDeleteMember(id: number) {
    return useMutation({
        mutationKey: ["delete_number", "delete-member", id],
        mutationFn: async () => {
            try {
                await invoke("delete_number", { id });
            } catch (error) {
                throw new Error(`Error: 'Deleting member': ${error}`);
            }
        },
    });
}
