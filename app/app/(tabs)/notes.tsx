import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
} from "react-native";
import React, { useState, useCallback } from "react";

type FoodItem = {
    name: string;
    calories: number;
};

type Note = {
    date: string;
    items: FoodItem[];
};

export default function NotesPage() {
    const today = new Date().toLocaleDateString();

    const [note, setNote] = useState<Note>({ date: today, items: [{ name: "", calories: 0 }] });

    const updateItemName = useCallback((index: number, value: string) => {
        setNote((prev) => {
            const items = prev.items.slice();
            items[index] = { ...items[index], name: value };

            if (index === items.length - 1 && value.trim() !== "") {
                items.push({ name: "", calories: 0 });
            }

            while (items.length > 1 && items[items.length - 1].name === "" && items[items.length - 2].name === "") {
                items.pop();
            }

            return { ...prev, items };
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{today}</Text>

            <FlatList
                data={note.items}
                keyExtractor={(_, index) => String(index)}
                style={styles.flat}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                    <View style={styles.listContainer}>

                        <TextInput
                            style={styles.input}
                            placeholder="Add food"
                            value={item.name}
                            onChangeText={(v) => updateItemName(index, v)}
                            returnKeyType="next"
                        />
                        <Text style={styles.itemCalories}>{`${item.calories ?? 0} kcal`}</Text>
                    </View>
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        backgroundColor: "#f5f5f5",
        paddingTop: 48,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    date: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 0,
        marginBottom: 12,
        alignSelf: "flex-start",
    },
    listContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    placeholder: {
        fontSize: 16,
        color: "#999",
        paddingTop: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
    },
    emptyText: {
        fontSize: 14,
        color: "#999",
        marginTop: 16,
    },
    flat: {
        width: "100%",
    },
    itemCalories: {
        fontSize: 14,
        color: "#666",
        width: 72,
        textAlign: "right",
    },
});
