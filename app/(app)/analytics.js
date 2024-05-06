import { Pressable, StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../utils/globalStyles.js'
import DashboardCard from '../../components/DashboardCard.js'
import { useMemo, useState } from 'react'
import CategoriesModal from '../../components/CatgegoriesModal.js'
import FInput from '../../components/FInput.js'

export default function Analytics() {
    const [category1, setCategory1] = useState('')
    const [categoryId1, setCategoryId1] = useState(null)
    const [categoryIdError1, setCategoryIdError1] = useState('')
    const [categoriesOpen1, setCategoriesOpen1] = useState(false)

    const [category2, setCategory2] = useState('')
    const [categoryId2, setCategoryId2] = useState(null)
    const [categoryIdError2, setCategoryIdError2] = useState('')
    const [categoriesOpen2, setCategoriesOpen2] = useState(false)

    const [category3, setCategory3] = useState('')
    const [categoryId3, setCategoryId3] = useState(null)
    const [categoryIdError3, setCategoryIdError3] = useState('')
    const [categoriesOpen3, setCategoriesOpen3] = useState(false)

    const categories = useMemo(
        () =>
            [
                { id: categoryId1, name: category1 },
                { id: categoryId2, name: category2 },
                { id: categoryId3, name: category3 },
            ].filter(category => category.id),
        [categoryId1, categoryId2, categoryId3]
    )

    return (
        <>
            <View style={styles.marginBottom}>
                <Text style={[globalStyles.titleLarge]}>Analytics</Text>

                <Text style={[globalStyles.text, styles.marginBottomSmall]}>
                    Select 1 - 3 categories to compare, then check below to see
                    the result!
                </Text>

                <Text style={globalStyles.textSmall}>
                    Want some inspiration? Select the "Income" and "Expenses"
                    categories to see how much you make vs how much you spend
                    each day
                </Text>
            </View>

            <View styles={styles.marginBottom}>
                <CategoriesModal
                    open={categoriesOpen1}
                    onChangeOpen={setCategoriesOpen1}
                    onCategorySelect={(categoryId, categoryName) => {
                        setCategoryId1(categoryId)
                        setCategory1(categoryName)
                        setCategoryIdError1('')
                    }}
                />

                <Pressable onPress={() => setCategoriesOpen1(true)}>
                    <FInput
                        label="Category 1"
                        value={category1}
                        onChange={setCategory1}
                        error={categoryIdError1}
                        onErrorChange={setCategoryIdError1}
                        disabled
                        forceEnabledStyle
                        hasClearButton
                    />
                </Pressable>

                <CategoriesModal
                    open={categoriesOpen2}
                    onChangeOpen={setCategoriesOpen2}
                    onCategorySelect={(categoryId, categoryName) => {
                        setCategoryId2(categoryId)
                        setCategory2(categoryName)
                        setCategoryIdError2('')
                    }}
                />
                <Pressable onPress={() => setCategoriesOpen2(true)}>
                    <FInput
                        label="Category 2"
                        value={category2}
                        onChange={setCategory2}
                        error={categoryIdError2}
                        onErrorChange={setCategoryIdError2}
                        disabled
                        forceEnabledStyle
                        hasClearButton
                    />
                </Pressable>

                <CategoriesModal
                    open={categoriesOpen3}
                    onChangeOpen={setCategoriesOpen3}
                    onCategorySelect={(categoryId, categoryName) => {
                        setCategoryId3(categoryId)
                        setCategory3(categoryName)
                        setCategoryIdError3('')
                    }}
                />
                <Pressable onPress={() => setCategoriesOpen3(true)}>
                    <FInput
                        label="Category 3"
                        value={category3}
                        onChange={setCategory3}
                        error={categoryIdError3}
                        onErrorChange={setCategoryIdError3}
                        disabled
                        forceEnabledStyle
                        hasClearButton
                    />
                </Pressable>
            </View>

            {categories.length > 0 && <DashboardCard categories={categories} />}
        </>
    )
}

const styles = StyleSheet.create({
    marginBottomSmall: {
        marginBottom: 10,
    },
    marginBottom: {
        marginBottom: 20,
    },
})
