import React, { useEffect, useState } from 'react'
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import { LuUsers } from "react-icons/lu";
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';

export const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([]);
        }
    }, [selectedUsers]);

    return (
        <div className="space-y-3 mt-2">
            {selectedUserAvatars.length === 0 && (
                <button
                    className="card-btn flex items-center gap-2 px-3 py-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <LuUsers className="text-base" /> Add Members
                </button>
            )}

            {selectedUserAvatars.length > 0 && (
                <div
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClick={() => setIsModalOpen(false)}
                title="Select Users"
            >
                <div className="space-y-3 h-[60vh] overflow-y-auto">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <img
                                src={user.profileImageUrl || undefined}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 text-primary border-gray-300 rounded-sm focus:ring-primary focus:ring-1"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        className="card-btn px-4 py-2"
                        onClick={() => setIsModalOpen(false)}
                    >
                        CANCEL
                    </button>
                    <button
                        className="card-btn-fill px-4 py-2"
                        onClick={handleAssign}
                    >
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;
