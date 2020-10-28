module.exports = (filter) => {
    switch (filter) {
    case null || undefined || '':
        return 'None';
    case 'invites':
        return 'Invites';
    case 'user':
        return 'User';
    case 'bots':
        return 'Bots';
    case 'you':
        return 'You';
    case 'uploads':
        return 'Uploads';
    case 'links':
        return 'Links';
    }
};