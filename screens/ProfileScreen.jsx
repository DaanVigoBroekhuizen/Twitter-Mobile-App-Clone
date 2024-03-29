import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Platform,
    Linking,
    ActivityIndicator
} from 'react-native';
import {EvilIcons} from "@expo/vector-icons";
import axiosConfig from "../helpers/axiosConfig";
import {format} from "date-fns";
import RenderItem from "../components/RenderItem";


export default function ProfileScreen({ route, navigation }) {
    const [data, setData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isAtEndOfScrolling, setisAtEndOfScrolling] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTweets, setIsLoadingTweets] = useState(true);

    useEffect(() => {
        getUserProfile();
        getUserTweets();
    }, [page]);

    function handleEnd() {
        setPage(page + 1);
    }

    function handleRefresh() {
        setPage(1);
        setisAtEndOfScrolling(false);
        setIsRefreshing(true);
        getUserTweets();
    };

    function getUserProfile() {
        axiosConfig
            .get(`/users/${route.params.userId}`)
            .then(response => {
                setUser(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log('dfjlsf;jsafjasdksjdklfjkl;afjsdklafj;lsajfsd;fasj');
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    function getUserTweets() {
        axiosConfig.get(`/users/${route.params.userId}/tweets?page=${page}`)
            .then(response => {
                if (page === 1) {
                    setData(response.data.data);
                } else {
                    setData([...data, ...response.data.data]);
                }

                if (!response.data.next_page_url) {
                    setisAtEndOfScrolling(true)
                }

                setIsLoadingTweets(false);
                setIsRefreshing(false);
            })
            .catch(error => {
                console.log('dfjlsf;jsafjasdksjdklfjkl;afjsdklafj;lsajfsd;fasj');
                setIsLoadingTweets(false);
                setIsRefreshing(false);
            });
    }

    const renderItem = ({ item }) => (
        <View style={{ marginVertical: 20 }}>
            <Text>{item.title}</Text>
        </View>
            );

    const ProfileHeader = () => (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#b100e2"/>
            ) : (
            <>
                <Image style={styles.backgroundImage} source={{
                    uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=' +
                        'rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
                }}
                />
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={{
                        uri: user.avatar,
                    }}
                    />
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.nameContainer}>
                    <Text style={styles.profileName}>{user.name}</Text>
                    <Text style={styles.profileHandle}>@{user.username}</Text>
                </View>

                <View style={styles.profileContainer}>
                    <Text style={styles.profileContainerText}>
                        {user.profile}
                    </Text>
                </View>

                <View style={styles.locationContainer}>
                    <EvilIcons name="location" size={24} color="gray" />
                    <Text style={styles.textGray}>{user.location}</Text>
                </View>

                <View style={styles.linkContainer}>
                    <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL(user.link)}
                    >
                        <EvilIcons name="link" size={24} color="gray"/>
                        <Text style={styles.linkColor}>{user.linkText}</Text>
                    </TouchableOpacity>
                    <View style={[styles.linkItem, styles.ml4]}>
                        <EvilIcons name="calendar" size={24} color="gray"/>
                        <Text style={styles.textGray}>Joined {format(new Date(user.created_at), 'MMM yyyy')}</Text>
                    </View>
                </View>

                <View style={styles.followContainer}>
                    <View style={styles.followItem}>
                        <Text style={styles.followItemNumber}>509</Text>
                        <Text style={styles.followItemLabel}>Following</Text>
                    </View>
                    <View style={[styles.followItem, styles.ml4]}>
                        <Text style={styles.followItemNumber}>2,354</Text>
                        <Text style={styles.followItemLabel}>Followers</Text>
                    </View>
                </View>

                <View style={styles.separator}></View>
            </>
                )}
        </View>
    );

    return (
        <View style={styles.container}>

        {isLoading ? (
                <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#b100e2"/>
            ) : (
        <FlatList
            data={data}
            renderItem={props => <RenderItem {...props} />}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
            ListHeaderComponent={ProfileHeader}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReached={handleEnd}
            onEndReachedThreshold={0}
            ListFooterComponent={() => !isAtEndOfScrolling && (
                <ActivityIndicator size="large" color="#b100e2" />
            )}
            scrollIndicatorInsets={{ right: 1 }}
        />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        width: 800,
        height: 120,
    },
    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-end",
        paddingHorizontal: 10,
        marginTop: -34,
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
    },
    followButton: {
        backgroundColor: '#0f1418',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    followButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    nameContainer: {
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    profileName: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    profileHandle: {
        color: 'gray',
        marginTop: 1,
    },
    profileContainer: {
        paddingHorizontal: 10,
        marginTop: 8,
    },
    profileContainerText: {
        lineHeight: 22,
    },
    locationContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginTop: 12,
    },
    linkContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginTop: 4,
    },
    textGray: {
        color: 'gray',
    },
    ml4: {
        marginLeft: 16,
    },
    linkColor: {
        color: '#1d9bf1',
    },
    linkItem: {
        flexDirection: "row",
    },
    followContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    followItem: {
        flexDirection: 'row',
    },
    followItemNumber: {
        fontWeight: 'bold',
    },
    followItemLabel: {
        marginLeft: 4,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
});