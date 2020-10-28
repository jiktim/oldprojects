module.exports = (region) => {
    switch (region) {
    case 'brazil':
        return 'Brazil :flag_br:';
    case 'eu-central':
        return 'Central Europe :flag_eu:';
    case 'eu-west':
        return 'Western Europe :flag_eu:';
    case 'hongkong':
        return 'Hong Kong :flag_hk:';
    case 'london':
        return 'London :flag_gb:';
    case 'japan':
        return 'Japan :flag_jp:';
    case 'russia':
        return 'Russia :flag_ru:';
    case 'singapore':
        return 'Singapore :flag_sg:';
    case 'sydney':
        return 'Sydney :flag_au:';
    case 'us-central':
        return 'US Central :flag_us:';
    case 'us-east':
        return 'US East :flag_us:';
    case 'us-south':
        return 'US South :flag_us:';
    case 'us-west':
        return 'US West :flag_us:';
    }
};