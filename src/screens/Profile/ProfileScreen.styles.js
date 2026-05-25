// src/screens/Profile/ProfileScreen.styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: { padding: 16, paddingTop: 22, alignItems: 'center' },
    avatar: { width: 110, height: 110, borderRadius: 55 },

    editIcon: {
        position: 'absolute',
        right: 0,
        top: 78,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F4B400',
        alignItems: 'center',
        justifyContent: 'center',
    },

    emailText: { marginTop: 12, fontSize: 22, fontWeight: '800', color: '#000' },
    followText: { marginTop: 6, fontSize: 14, color: '#666', textAlign: 'center' },

    badgeRow: { marginTop: 10, flexDirection: 'row', gap: 8 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeText: { fontWeight: '800', fontSize: 12 },

    vipButton: {
        marginTop: 12,
        backgroundColor: '#111',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    vipButtonText: { color: '#fff', fontWeight: '800' },

    card: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#333' },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    infoLabel: { fontSize: 14, color: '#666' },
    infoValue: { fontSize: 14, color: '#111', maxWidth: '60%', textAlign: 'right' },

    menu: { marginTop: 18, paddingHorizontal: 16, paddingBottom: 24 },
    menuHeader: { fontSize: 16, fontWeight: '800', color: '#666', marginBottom: 10 },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    menuText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },
});

export default styles;
