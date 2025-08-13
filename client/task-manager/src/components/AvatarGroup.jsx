import React from 'react';

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
    return (
        <div className="flex items-center">
            {avatars.slice(0, maxVisible).map((avatar, index) => (
                <img
                    key={index}
                    src={avatar || undefined}
                    alt={`Avatar ${index}`}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover -ml-3 first:ml-0 shadow-sm"
                />
            ))}

            {avatars.length > maxVisible && (
                <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-700 text-sm font-medium rounded-full border-2 border-white -ml-3 shadow-sm">
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
