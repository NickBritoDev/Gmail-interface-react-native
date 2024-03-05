import { Slot } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function _layout() {


    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar  barStyle={'dark-content'} translucent={true} backgroundColor='#f1f1f1' />
            <Slot />
        </SafeAreaView>
    )
}
