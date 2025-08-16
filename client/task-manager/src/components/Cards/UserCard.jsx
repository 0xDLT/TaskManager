import React from 'react'

const UserCard = ({ userInfo }) => {
    return (
        <div className='user-card p-2'>
            <div className='flex items-center justify-between '>
                <div className='flex items-center gap-3'>
                    <img
                        src={userInfo?.profileImageUrl || undefined}
                        alt={`Avatar`}
                        className='w-12 h-12 rounded-full border-2 border-white'
                    />

                    <div>
                        <p className='text-sm font-medium'>{userInfo?.name || "Unknown User"}</p>
                        <p className='text-sx text-gray-500'>{userInfo?.email || "No email"}</p>
                    </div>
                </div>
            </div>
            <div className='flex items-end gap-3 mt-5'>
                <StateCard
                    label="Pending"
                    count={userInfo?.pendingTasks || 0}
                    status="Pending"
                />

                <StateCard
                    label="inProgress"
                    count={userInfo?.inProgressTasks || 0}
                    status="inProgress"
                />

                <StateCard
                    label="Done"
                    count={userInfo?.completedTasks || 0}
                    status="Done"
                />
            </div>
        </div>
    )
}

export default UserCard

const StateCard = ({ label, count, status }) => {
    const getStatusTagColor = () => {
        switch (status) {
            case "inProgress":
                return "text-cyan-500 bg-gray-50";
            case "Done":
                return "text-indigo-500 bg-gray-50"

            default:
                return "text-violet-500 bg-gray-50"
        }
    }

    return (
        <div
            className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
            <span className='text-[12px] font-semibold'>{count}</span> <br /> {label}
        </div>
    )
};