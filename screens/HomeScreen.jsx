import React, {useEffect, useRef, useState} from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    ActivityIndicatorComponent
} from 'react-native';

import axiosConfig from "../helpers/axiosConfig";
import {formatDistanceToNowStrict} from "date-fns";
import locale from 'date-fns/locale/en-US';
import formatDistance from '../helpers/formatDistanceCustom';

export default function HomeScreen({ route, navigation }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isAtEndOfScrolling, setisAtEndOfScrolling] = useState(false);
    const flatListRef = useRef();
    
    useEffect(() => {
        getAllTweets();
    }, [page]);

    useEffect(() => {
        if (route.params?.newTweetAdded) {
            getAllTweetsRefresh();
            flatListRef.current.scrollToOffset({
                offset: 0,
            })
        }
    }, [route.params?.newTweetAdded]);

    function getAllTweetsRefresh() {
        setPage(1)
        setisAtEndOfScrolling(false);
        setIsRefreshing(false);

        axiosConfig
            .get(`/tweets`)
            .then(response => {
                setData(response.data.data);
                setIsLoading(false);
                setIsRefreshing(false);
            })
            .catch(error => {
                console.log('dfjlsf;jsafjasdksjdklfjkl;afjsdklafj;lsajfsd;fasj');
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    function getAllTweets() {
        // instance.get('http://localhost/api/tweets')
        axiosConfig.get(`/tweets?page=${page}`)
            .then(response => {
                if (page === 1) {
                    setData(response.data.data);
                } else {
                    setData([...data, ...response.data.data]);
                }

                if (!response.data.next_page_url) {
                    setisAtEndOfScrolling(true)
                }

                setIsLoading(false);
                setIsRefreshing(false);
            })
            .catch(error => {
                console.log('dfjlsf;jsafjasdksjdklfjkl;afjsdklafj;lsajfsd;fasj');
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    function handleRefresh() {
        setPage(1);
        setisAtEndOfScrolling(false);
        setIsRefreshing(true);
        getAllTweets();
    };

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    function handleEnd() {
        setPage(page + 1);
    }

    function gotoProfile(userId) {
        navigation.navigate('Profile Screen', {
            userId: userId,
        });
    }

    function gotoSingleTweet(tweetId) {
        navigation.navigate('Tweet Screen', {
            tweetId: tweetId,
        });
    }

    function gotoNewTweet() {
        navigation.navigate('New Tweet');
    }

    const renderItem = ({ item: tweet }) => (
        <View style={styles.tweetContainer}>
            <TouchableOpacity onPress={() => gotoProfile(tweet.user.id)}>
                <Image style={styles.avatar} source={{
                    uri: tweet.user.avatar,
                }}
                />
            </TouchableOpacity>
            <View style={{ flex: 1}}>
                <TouchableOpacity style={styles.flexRow} onPress={() => gotoSingleTweet(tweet.id)}>
                    <Text numberOfLines={1} style={styles.tweetName}>{tweet.user.name}</Text>
                    <Text numberOfLines={1} style={styles.tweetHandle}>@{tweet.user.username}</Text>
                    <Text>&middot;</Text>
                    <Text numberOfLines={1} style={styles.tweetHandle}>
                        {formatDistanceToNowStrict(new Date(tweet.created_at), {
                            locale: {
                                ...locale,
                                formatDistance,
                            },
                        })}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tweetContentContainer} onPress={() => gotoSingleTweet(tweet.id)}>
                    <Text style={styles.tweetContent}>
                        {tweet.body}
                    </Text>
                </TouchableOpacity>
                <View style={styles.tweetEngagement}>
                    <TouchableOpacity style={styles.flexRow}>
                        <EvilIcons
                            name="comment"
                            size={22}
                            color="gray"
                            style={{ marginRight: 2 }}
                        />
                        <Text style={styles.textGray}>456</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
                        <EvilIcons
                            name="retweet"
                            size={22}
                            color="gray"
                            style={{ marginRight: 2 }}
                        />
                        <Text style={styles.textGray}>16</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
                        <EvilIcons
                            name="heart"
                            size={22}
                            color="gray"
                            style={{ marginRight: 2 }}
                        />
                        <Text style={styles.textGray}>7,456</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
                        <EvilIcons
                            name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
                            size={22}
                            color="gray"
                            style={{ marginRight: 2 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
            <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#b100e2"/>
                ) : (
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={() => (<View style={styles.tweetSeparator}/>)}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handleEnd}
                onEndReachedThreshold={0}
                ListFooterComponent={() => !isAtEndOfScrolling && (
                    <ActivityIndicator size="large" color="#b100e2" />
                )}
            />
                )}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => gotoNewTweet()}
            >
                <AntDesign name="plus" size={26} color="white"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tweetContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    tweetSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: 8,
        borderRadius: 21,
    },
    flexRow: {
        flexDirection: 'row',
    },
    tweetName: {
        fontWeight: 'bold',
        color: '#222222',
    },
    tweetHandle: {
        marginHorizontal: 8,
        color: 'gray',
    },
    tweetContentContainer: {
        marginTop: 4,
    },
    tweetContent: {
        lineHeight: 20,
    },
    textGray: {
        color: 'gray',
    },
    tweetEngagement: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    ml4: {
        marginLeft: 16,
    },
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d9bf1',
        position: 'absolute',
        bottom: 20,
        right: 12,
    },
})