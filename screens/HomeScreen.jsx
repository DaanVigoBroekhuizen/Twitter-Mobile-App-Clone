import React, {useEffect, useState} from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';

import axios from 'axios';
import {formatDistanceToNowStrict} from "date-fns";
import locale from 'date-fns/locale/en-US';
import formatDistance from '../helpers/formatDistanceCustom';

export default function HomeScreen({navigation}) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    useEffect(() => {
        getAllTweets();
    }, []);

    const axiosInt = axios.create();

    function getAllTweets() {
        // instance.get('http://localhost/api/tweets')
        axiosInt.get('https://1a9b-149-143-60-69.ngrok.io/api/tweets')
            .then(response => {
                setData(response.data);
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
        setIsRefreshing(true);
        getAllTweets();
    };

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    function gotoProfile() {
        navigation.navigate('Profile Screen');
    }

    function gotoSingleTweet() {
        navigation.navigate('Tweet Screen');
    }

    function gotoNewTweet() {
        navigation.navigate('New Tweet');
    }

    const renderItem = ({ item: tweet }) => (
        <View style={styles.tweetContainer}>
            <TouchableOpacity onPress={() => gotoProfile()}>
                <Image style={styles.avatar} source={{
                    uri: tweet.user.avatar,
                }}
                />
            </TouchableOpacity>
            <View style={{ flex: 1}}>
                <TouchableOpacity style={styles.flexRow} onPress={() => gotoSingleTweet()}>
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
                <TouchableOpacity style={styles.tweetContentContainer} onPress={() => gotoSingleTweet()}>
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
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={() => (<View style={styles.tweetSeparator}/>)}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
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