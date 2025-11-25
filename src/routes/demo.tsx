import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/demo")({
    component: App,
});

interface Member {
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

function App() {
    const [members, setMembers] = useState<Member[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [searchCnic, setSearchCnic] = useState("");
    const [message, setMessage] = useState("");
    const [viewingMember, setViewingMember] = useState<Member | null>(null);

    const [formData, setFormData] = useState<Member>({
        name: "",
        father_husband_name: "",
        gender: "Male",
        cnic_number: "",
        date_of_birth: "",
        date_of_issue: "",
        date_of_expiry: "",
        cnic_front_image: null,
        cnic_back_image: null,
    });

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const allMembers = await invoke<Member[]>("get_all_members");
            setMembers(allMembers);
        } catch (error) {
            showMessage(`Error loading members: ${error}`);
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const fileToByteArray = (file: File): Promise<number[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = Array.from(new Uint8Array(arrayBuffer));
                resolve(byteArray);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    // Convert byte array to base64 for display
    const byteArrayToBase64 = (byteArray: number[] | null | undefined): string | null => {
        if (!byteArray || byteArray.length === 0) return null;
        const uint8Array = new Uint8Array(byteArray);
        let binary = "";
        uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
        return `data:image/jpeg;base64,${btoa(binary)}`;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: "front" | "back") => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            showMessage("Please select an image file");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showMessage("Image size must be less than 5MB");
            return;
        }

        try {
            const byteArray = await fileToByteArray(file);
            setFormData({
                ...formData,
                [imageType === "front" ? "cnic_front_image" : "cnic_back_image"]: byteArray,
            });
            showMessage(`${imageType === `front` ? `Front` : `Back`} image uploaded successfully`);
        } catch (error) {
            showMessage(`Error uploading image: ${error}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingMember && editingMember.id) {
                await invoke("update_member", {
                    id: editingMember.id,
                    member: formData,
                });
                showMessage("Member updated successfully!");
            } else {
                await invoke("add_member", { member: formData });
                showMessage("Member added successfully!");
            }

            resetForm();
            loadMembers();
        } catch (error) {
            showMessage(`Error: ${error}`);
        }
    };

    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setFormData(member);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await invoke("delete_member", { id });
                showMessage("Member deleted successfully!");
                loadMembers();
            } catch (error) {
                showMessage(`Error: ${error}`);
            }
        }
    };

    const handleSearch = async () => {
        if (!searchCnic.trim()) {
            loadMembers();
            return;
        }

        try {
            const member = await invoke<Member | null>("get_member_by_cnic", {
                cnicNumber: searchCnic,
            });

            if (member) {
                setMembers([member]);
            } else {
                showMessage("No member found with this CNIC");
                setMembers([]);
            }
        } catch (error) {
            showMessage(`Error: ${error}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            father_husband_name: "",
            gender: "Male",
            cnic_number: "",
            date_of_birth: "",
            date_of_issue: "",
            date_of_expiry: "",
            cnic_front_image: null,
            cnic_back_image: null,
        });
        setEditingMember(null);
        setShowForm(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Member Registry System</h1>
                    <p className="text-gray-600">Manage member information and CNIC records</p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${
                            message.includes("Error")
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Search and Add Button */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by CNIC Number..."
                                value={searchCnic}
                                onChange={(e) => setSearchCnic(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                            <button
                                onClick={loadMembers}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            + Add New Member
                        </button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {editingMember ? "Edit Member" : "Add New Member"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Father/Husband Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="father_husband_name"
                                        required
                                        value={formData.father_husband_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                    <select
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNIC Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="cnic_number"
                                        required
                                        placeholder="12345-1234567-1"
                                        value={formData.cnic_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        required
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Issue *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_issue"
                                        required
                                        value={formData.date_of_issue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Expiry *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_expiry"
                                        required
                                        value={formData.date_of_expiry}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* CNIC Image Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNIC Front Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, "front")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {formData.cnic_front_image && (
                                        <div className="mt-2">
                                            <img
                                                src={byteArrayToBase64(formData.cnic_front_image) || ""}
                                                alt="CNIC Front"
                                                className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNIC Back Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, "back")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {formData.cnic_back_image && (
                                        <div className="mt-2">
                                            <img
                                                src={byteArrayToBase64(formData.cnic_back_image) || ""}
                                                alt="CNIC Back"
                                                className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingMember ? "Update Member" : "Add Member"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Members Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Registered Members ({members.length})</h2>
                    </div>

                    {members.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p className="text-lg">No members found</p>
                            <p className="text-sm mt-2">Add a new member to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Father/Husband
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CNIC Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date of Birth
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Images
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {member.father_husband_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {member.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{member.cnic_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{member.date_of_birth}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setViewingMember(member)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    {member.cnic_front_image || member.cnic_back_image
                                                        ? "📷 View"
                                                        : "❌ No Images"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => member.id && handleDelete(member.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Image Viewer Modal */}
                {viewingMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        CNIC Images - {viewingMember.name}
                                    </h3>
                                    <button
                                        onClick={() => setViewingMember(null)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">CNIC Front</h4>
                                        {viewingMember.cnic_front_image ? (
                                            <img
                                                src={byteArrayToBase64(viewingMember.cnic_front_image) || ""}
                                                alt="CNIC Front"
                                                className="w-full rounded-lg border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                No image available
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">CNIC Back</h4>
                                        {viewingMember.cnic_back_image ? (
                                            <img
                                                src={byteArrayToBase64(viewingMember.cnic_back_image) || ""}
                                                alt="CNIC Back"
                                                className="w-full rounded-lg border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                No image available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => setViewingMember(null)}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
