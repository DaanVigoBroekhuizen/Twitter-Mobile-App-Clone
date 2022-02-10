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

import RenderItem from "../components/RenderItem";

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

    function gotoNewTweet() {
        navigation.navigate('New Tweet');
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
            <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#b100e2"/>
                ) : (
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={props => <RenderItem {...props} />}
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
    tweetSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
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
});