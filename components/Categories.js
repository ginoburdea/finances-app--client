import PropTypes from 'prop-types'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { gql, useQuery } from '@apollo/client'
import { UNKNOWN_ERROR_NO_INFO } from '../utils/errors.js'
import { useState } from 'react'

const GET_CATEGORIES_QUERY = gql`
    query($parentId: ID) {
        categories(getCategoriesInput: { parent: $parentId }) {
            _id
            name
            hasChildren
        }
    }
`

/**
 * @param {{parentId?: string, depth?: number, onCategorySelect: (categoryId: string, categoryName) => any}} param0
 */
export default function Categories({
    parentId = null,
    depth = 0,
    onCategorySelect,
}) {
    const { loading, data, error } = useQuery(GET_CATEGORIES_QUERY, {
        variables: { parentId },
    })

    const [isOpen, setIsOpen] = useState({})

    const sharedStyles = [styles.container, { paddingLeft: 20 + depth * 40 }]

    return (
        <>
            {loading && (
                <Text style={[...sharedStyles, globalStyles.textSmall]}>
                    Loading...{' '}
                </Text>
            )}

            {error && (
                <Text style={[...sharedStyles, globalStyles.error]}>
                    {UNKNOWN_ERROR_NO_INFO}
                </Text>
            )}

            {data &&
                data.categories.map(category => (
                    <>
                        <View style={[...sharedStyles, styles.category]}>
                            <Pressable
                                onPress={() =>
                                    onCategorySelect(
                                        category._id,
                                        category.name
                                    )
                                }
                            >
                                <Text style={[globalStyles.text]}>
                                    {category.name}
                                </Text>
                            </Pressable>
                            {category.hasChildren && (
                                <Pressable
                                    onPress={() =>
                                        setIsOpen({
                                            ...isOpen,
                                            [category._id]: !isOpen[
                                                category._id
                                            ],
                                        })
                                    }
                                >
                                    <View style={styles.iconContainer}>
                                        <Image
                                            style={[
                                                styles.icon,
                                                isOpen[category._id]
                                                    ? styles.rotate180
                                                    : {},
                                            ]}
                                            source={require('../assets/arrow-down.png')}
                                        />
                                    </View>
                                </Pressable>
                            )}
                        </View>
                        {category.hasChildren && isOpen[category._id] && (
                            <Categories
                                depth={depth + 1}
                                parentId={category._id}
                                onCategorySelect={onCategorySelect}
                            />
                        )}
                    </>
                ))}
        </>
    )
}

Categories.propTypes = {
    parentId: PropTypes.string,
    depth: PropTypes.number,
    onCategorySelect: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
    },
    category: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 4,
    },
    icon: {
        height: 16,
        width: 16,
    },
    rotate180: {
        transform: [{ rotate: '180deg' }],
    },
})
