import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import axiosConfig from "../helpers/axiosConfig";
import {format} from "date-fns";

export default function TweetScreen({ route, navigation }) {
    const [tweet, setTweet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTweet();
    }, []);


    function getTweet() {
        axiosConfig.get(`/tweets/${route.params.tweetId}`)
            .then(response => {
                setTweet(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log('dfjlsf;jsafjasdksjdklfjkl;afjsdklafj;lsajfsd;fasj');
                setIsLoading(false);
            });
    }

    function gotoProfile(userId) {
        navigation.navigate('Profile Screen', {
            userId: userId,
        });
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#b100e2"/>
            ) : (
            <>
                <View style={styles.profileContainer}>
                    <TouchableOpacity style={styles.flexRow} onPress={() => gotoProfile(tweet.user.id)}>
                        <Image style={styles.avatar} source={{
                            uri: tweet.user.avatar,
                        }}
                        />
                        <View>
                            <Text style={styles.tweetName}>{tweet.user.name}</Text>
                            <Text style={styles.tweetHandle}>@{tweet.user.username}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Entypo name="dots-three-vertical" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <View style={styles.tweetContentContainer}>
                    <Text style={styles.tweetContent}>
                        {tweet.body}
                    </Text>
                    <View style={styles.tweetTimestampContainer}>
                        <Text style={styles.tweetTimestampText}>{format(new Date(tweet.created_at),
                            'h:mm a')}</Text>
                        <Text style={styles.tweetTimestampText}>&middot;</Text>
                        <Text style={styles.tweetTimestampText}>{format(new Date(tweet.created_at),
                            'd MMM.yy')}</Text>
                        <Text style={styles.tweetTimestampText}>&middot;</Text>
                        <Text style={[styles.tweetTimestampText, styles.linkColor]}>
                            Twitter for iPhone
                        </Text>
                    </View>
                </View>


                <View style={styles.tweetEngagement}>
                    <View style={styles.flexRow}>
                        <Text style={styles.tweetEngagementNumber}>628</Text>
                        <Text style={styles.tweetEngagementLabel}>Retweets</Text>
                    </View>
                    <View style={[styles.flexRow, styles.ml4]}>
                        <Text style={styles.tweetEngagementNumber}>40</Text>
                        <Text style={styles.tweetEngagementLabel}>Quote Tweet</Text>
                    </View>
                    <View style={[styles.flexRow, styles.ml4]}>
                        <Text style={styles.tweetEngagementNumber}>3,986</Text>
                        <Text style={styles.tweetEngagementLabel}>Likes</Text>
                    </View>
                </View>
                <View style={[styles.tweetEngagement, styles.spaceAround]}>
                    <TouchableOpacity>
                        <EvilIcons
                            name="comment"
                            size={32}
                            color="gray"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <EvilIcons
                            name="retweet"
                            size={32}
                            color="gray"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <EvilIcons
                            name="heart"
                            size={32}
                            color="gray"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <EvilIcons
                            name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
                            size={32}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
            </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    flexRow: {
        flexDirection: 'row',
    },
    avatar: {
        height: 50,
        width: 50,
        marginRight: 8,
        borderRadius: 25,
    },
    tweetName: {
        fontWeight: 'bold',
        color: '#222222',
    },
    tweetHandle: {
        color: 'gray',
        marginTop: 4,
    },
    tweetContentContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tweetContent: {
        fontSize: 20,
        lineHeight: 30,
    },
    tweetEngagement: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tweetEngagementNumber: {
        fontWeight: 'bold',
    },
    tweetEngagementLabel: {
        color: 'gray',
        marginLeft: 6,
    },
    spaceAround: {
      justifyContent: 'space-around',
    },
    ml4: {
        marginLeft: 16,
    },
    tweetTimestampContainer: {
        flexDirection: "row",
        marginTop: 12,
    },
    tweetTimestampText: {
        color: "gray",
        marginRight: 6,
    },
    linkColor: {
        color: '#1d9bf1',
    },
});