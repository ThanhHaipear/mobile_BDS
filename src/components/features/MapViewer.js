// src/components/features/MapViewer.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewer = ({ location, title }) => {
    if (!location) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={{ color: 'gray' }}>Không có thông tin bản đồ</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    ...location,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                scrollEnabled={false} // Chỉ xem, không cho trượt lung tung
            >
                <Marker coordinate={location} title={title} />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 200, borderRadius: 10, overflow: 'hidden', marginVertical: 10 },
    map: { flex: 1 },
    emptyContainer: { height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10 }
});

export default MapViewer;