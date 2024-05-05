import { useClickOutside } from 'react-native-click-outside'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import Categories from './Categories.js'

export default function CategoriesModal({
    open,
    onChangeOpen,
    onCategorySelect,
}) {
    const clickOutsideRef = useClickOutside(() => onChangeOpen(false))

    return (
        <Modal
            visible={open}
            onRequestClose={() => onChangeOpen(false)}
            transparent={true}
        >
            <View style={styles.categoriesContainer}>
                <ScrollView
                    style={[globalStyles.roundedMedium, styles.categories]}
                    ref={clickOutsideRef}
                >
                    <Text
                        style={[
                            globalStyles.titleMedium,
                            styles.categoriesTitle,
                        ]}
                    >
                        Category
                    </Text>

                    <Categories
                        onCategorySelect={(...args) => {
                            onCategorySelect(...args)
                            onChangeOpen(false)
                        }}
                    />
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    categoriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    categories: {
        backgroundColor: colors.primary.highlight,
        maxHeight: '70%',
        flexGrow: 0,
    },
    categoriesTitle: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
})
