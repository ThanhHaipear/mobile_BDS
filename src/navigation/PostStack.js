import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePostScreen from '../screens/Post/CreatePostScreen';
import PickLocationScreen from '../screens/Post/PickLocationScreen';

const Stack = createNativeStackNavigator();

export default function PostStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="PickLocation" component={PickLocationScreen} />
        </Stack.Navigator>
    );
}
