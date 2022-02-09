import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Platform} from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

export default function TweetScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.flexRow}>
                    <Image style={styles.avatar} source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                    />
                    <View>
                        <Text style={styles.tweetName}>Daan Broekhuizen</Text>
                        <Text style={styles.tweetHandle}>@daanhimself</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <View style={styles.tweetContentContainer}>
                <Text style={styles.tweetContent}>Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit. Ab aliquid, aspernatur commodi
                </Text>
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
});