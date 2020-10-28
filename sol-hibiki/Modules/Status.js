module.exports = (status) => {
    switch (status) {
    case 'online':
        return 'Online';
    case 'idle':
        return 'Away/Busy';
    case 'dnd':
        return 'Do not Disturb';
    case 'offline':
        return 'Invisible/Offline';
    }
};