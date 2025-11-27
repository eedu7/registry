import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import type { Member } from "@/types/members";

// Query Keys - Centralized for consistency
const QUERY_KEYS = {
    allMembers: ["members", "all"] as const,
    memberByCnic: (cnic: string) => ["members", "by-cnic", cnic] as const,
    memberById: (id: number) => ["members", "by-id", id] as const,
} as const;

// Fetch a single member by their CNIC number.
export function useGetMemberByCnic(cnicNumber: string) {
    return useQuery({
        queryKey: QUERY_KEYS.memberByCnic(cnicNumber),
        queryFn: async () => {
            try {
                const member = await invoke<Member>("get_member_by_cnic", {
                    cnicNumber,
                });
                return member;
            } catch (error) {
                throw new Error(`Failed to fetch member by CNIC: ${error}`);
            }
        },
        enabled: !!cnicNumber,
    });
}

// Fetch a single member by their id.
export function useGetMemberById(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.memberById(id),
        queryFn: async () => {
            try {
                const member = await invoke<Member>("get_member_by_id", {
                    id,
                });
                return member;
            } catch (error) {
                throw new Error(`Failed to fetch member by ID: ${error}`);
            }
        },
        enabled: !!id && id > 0,
    });
}

// Fetch all members from the database.
export function useGetMembers() {
    return useQuery({
        queryKey: QUERY_KEYS.allMembers,
        queryFn: async () => {
            try {
                const members = await invoke<Member[]>("get_all_members");
                return members;
            } catch (error) {
                throw new Error(`Failed to fetch members: ${error}`);
            }
        },
    });
}

// Create a new member using provided form data.
export function useCreateMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (member: Omit<Member, "id">) => {
            try {
                const result = await invoke<Member>("add_member", {
                    member,
                });
                return result;
            } catch (error) {
                throw new Error(`Failed to create member: ${error}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["members"],
            });
            toast.success("New member registered successfully");
        },
        onError: (error) => {
            console.error("Create member error:", error);
            toast.error(error.message || "Failed to register member");
        },
    });
}

// Update an existing member using their ID.
export function useUpdateMember(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (member: Partial<Member>) => {
            try {
                const result = await invoke<Member>("update_member", {
                    id,
                    member,
                });
                return result;
            } catch (error) {
                throw new Error(`Failed to update member: ${error}`);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["members"],
            });

            if (data) {
                queryClient.setQueryData(QUERY_KEYS.memberById(id), data);
            }

            toast.success("Member updated successfully");
        },
        onError: (error) => {
            console.error("Update member error:", error);
            toast.error(error.message || "Failed to update member");
        },
    });
}

// Delete a member by their ID.
export function useDeleteMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            try {
                await invoke("delete_member", { id });
                return id;
            } catch (error) {
                throw new Error(`Failed to delete member: ${error}`);
            }
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({
                queryKey: ["members"],
            });

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.memberById(deletedId),
            });

            toast.success("Member deleted successfully");
        },
        onError: (error) => {
            console.error("Delete member error:", error);
            toast.error(error.message || "Failed to delete member");
        },
    });
}
