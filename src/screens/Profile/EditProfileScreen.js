// src/screens/Profile/EditProfileScreen.js
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import client from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const onlyDigits = (s) => (s || '').toString().replace(/\D+/g, '');

const toAbsoluteMediaUrl = (maybePath) => {
    if (!maybePath) return '';
    const s = String(maybePath).trim();
    if (!s) return '';
    if (s.startsWith('http://') || s.startsWith('https://')) return s;

    const base = (client?.defaults?.baseURL || '').replace(/\/+$/, '');
    const path = s.replace(/^\/+/, '');
    return base ? `${base}/${path}` : s;
};

export default function EditProfileScreen({ route, navigation }) {
    const { profile } = route.params || {};

    const [email] = useState(profile?.email ?? '');
    const [username] = useState(profile?.username ?? ''); // khóa

    const [firstName, setFirstName] = useState(profile?.first_name ?? '');
    const [lastName, setLastName] = useState(profile?.last_name ?? '');

    const [phone, setPhone] = useState(profile?.so_dien_thoai ?? profile?.phone ?? '');
    const [cccd, setCccd] = useState(profile?.cccd_number ?? profile?.cccd ?? profile?.so_cccd ?? '');

    const [address, setAddress] = useState(profile?.address ?? '');
    const [bio, setBio] = useState(profile?.bio ?? '');

    // avatar hiển thị
    const initialAvatarAbs = toAbsoluteMediaUrl(profile?.anh_dai_dien) || DEFAULT_AVATAR;
    const [avatar, setAvatar] = useState(initialAvatarAbs);

    // avatarLocal để upload
    const [avatarLocal, setAvatarLocal] = useState(null);

    const [loading, setLoading] = useState(false);

    const phoneDigits = useMemo(() => onlyDigits(phone).slice(0, 10), [phone]);
    const cccdDigits = useMemo(() => onlyDigits(cccd).slice(0, 12), [cccd]);

    const validatePhone = (v) => {
        const s = onlyDigits(v);
        if (!s) return true;
        return /^\d{10}$/.test(s);
    };

    const validateCCCD = (v) => {
        const s = onlyDigits(v);
        if (!s) return true;
        return /^\d{12}$/.test(s);
    };

    const pickAvatar = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled) {
                const asset = result.assets?.[0];
                if (!asset?.uri) return;

                setAvatarLocal({ uri: asset.uri });
                setAvatar(asset.uri); // preview ngay
            }
        } catch (e) {
            console.log('pickAvatar error:', e?.message || e);
            Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
        }
    };

    // 1) Update text profile (JSON)
    const updateProfileText = async (payload) => {
        // Backend bạn từng báo PATCH 405, nên ưu tiên PUT
        // Nếu backend chỉ hỗ trợ POST, bạn đổi sang client.post(...)
        return client.put(ENDPOINTS.PROFILE_UPDATE, payload);
    };

    // 2) Upload avatar riêng (multipart)
    const uploadAvatar = async (uri) => {
        const form = new FormData();
        form.append('avatar', {
            uri,
            name: `avatar_${Date.now()}.jpg`,
            type: 'image/jpeg',
        });

        return client.post(ENDPOINTS.UPLOAD_IMAGE, form, {
            headers: {
                // ép multipart để tránh bị client set application/json
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data) => data, // chặn axios stringify FormData
        });
    };


    const handleSave = async () => {
        try {
            const firstNameTrim = (firstName || '').trim();
            const lastNameTrim = (lastName || '').trim();

            const phoneTrim = onlyDigits(phoneDigits).slice(0, 10);
            const cccdTrim = onlyDigits(cccdDigits).slice(0, 12);

            const addressTrim = (address || '').trim();
            const bioTrim = (bio || '').trim();

            if (!validatePhone(phoneTrim)) return Alert.alert('Lỗi', 'Số điện thoại phải đúng 10 chữ số');
            if (!validateCCCD(cccdTrim)) return Alert.alert('Lỗi', 'Số CCCD phải đúng 12 chữ số');

            setLoading(true);

            // ✅ STEP 1: update text
            const payload = {
                first_name: firstNameTrim,
                last_name: lastNameTrim,
                so_dien_thoai: phoneTrim || '',
                cccd_number: cccdTrim || '',
                address: addressTrim || '',
                bio: bioTrim || '',
            };

            const resText = await updateProfileText(payload);

            // ✅ STEP 2: upload avatar nếu có chọn ảnh mới
            let resAvatarData = null;
            if (avatarLocal?.uri) {
                try {
                    const resAvatar = await uploadAvatar(avatarLocal.uri);
                    resAvatarData = resAvatar?.data;
                } catch (e) {
                    console.log('UPLOAD AVATAR STATUS:', e?.response?.status);
                    console.log('UPLOAD AVATAR DATA:', e?.response?.data || e?.message);

                    // Nếu key "avatar" sai, thử đổi key sang "anh_dai_dien"
                    Alert.alert(
                        'Lỗi upload ảnh',
                        'Không upload được ảnh. Nếu backend yêu cầu field khác, hãy báo mình để đổi key upload.'
                    );
                    // vẫn cho phép lưu text thành công
                }
            }

            // ✅ set avatar url mới nếu backend trả về path/url
            const merged = {
                ...(resText?.data || {}),
                ...(resAvatarData || {}),
            };

            const newAvatar =
                toAbsoluteMediaUrl(merged?.anh_dai_dien || merged?.avatar || merged?.image || merged?.url) ||
                toAbsoluteMediaUrl(resText?.data?.anh_dai_dien) ||
                initialAvatarAbs ||
                DEFAULT_AVATAR;

            // cache-bust để load ảnh mới
            setAvatar(`${newAvatar}?t=${Date.now()}`);
            setAvatarLocal(null);

            Alert.alert('Thành công', 'Đã cập nhật thông tin tài khoản');
            navigation.goBack();
        } catch (e) {
            console.log('STATUS:', e?.response?.status);
            console.log('DATA:', e?.response?.data || e?.message);
            Alert.alert('Thất bại', 'Không cập nhật được thông tin. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>

                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" /> : <Text style={styles.saveText}>Lưu</Text>}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85}>
                            <Image source={{ uri: avatar || DEFAULT_AVATAR }} style={styles.avatar} />
                            <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Email</Text>
                    <TextInput value={email} editable={false} style={[styles.input, styles.readOnly]} />

                    <Text style={styles.label}>Tên đăng nhập</Text>
                    <TextInput value={username} editable={false} style={[styles.input, styles.readOnly]} />

                    <Text style={styles.label}>Họ</Text>
                    <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

                    <Text style={styles.label}>Tên</Text>
                    <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

                    <Text style={styles.label}>Số điện thoại (10 số)</Text>
                    <TextInput
                        value={phoneDigits}
                        onChangeText={(v) => setPhone(onlyDigits(v).slice(0, 10))}
                        style={styles.input}
                        keyboardType="phone-pad"
                        maxLength={10}
                        placeholder="Nhập số điện thoại"
                    />

                    <Text style={styles.label}>Số CCCD (12 số)</Text>
                    <TextInput
                        value={cccdDigits}
                        onChangeText={(v) => setCccd(onlyDigits(v).slice(0, 12))}
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={12}
                        placeholder="Nhập số CCCD"
                    />

                    <Text style={styles.label}>Địa chỉ</Text>
                    <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="Nhập địa chỉ" />

                    <Text style={styles.label}>Giới thiệu</Text>
                    <TextInput
                        value={bio}
                        onChangeText={setBio}
                        style={[styles.input, styles.textArea]}
                        multiline
                        placeholder="Nhập giới thiệu"
                    />

                    <View style={{ height: 80 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    saveText: { fontSize: 16, fontWeight: '700', color: '#F4B400' },

    content: { padding: 16, paddingBottom: 80, flexGrow: 1 },
    avatarWrapper: { alignItems: 'center', marginVertical: 16 },
    avatar: { width: 110, height: 110, borderRadius: 55 },
    changeAvatarText: { marginTop: 10, textAlign: 'center', color: '#F4B400', fontWeight: '700' },

    label: { fontSize: 14, color: '#444', marginTop: 12, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    readOnly: { backgroundColor: '#F6F6F6', color: '#666' },
    textArea: { height: 110, textAlignVertical: 'top' },
});
