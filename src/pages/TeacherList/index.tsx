import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather } from '@expo/vector-icons';
import TeacherItem, {Teacher} from '../../components/TeacherItem';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import PageHeader from '../../components/PageHeader';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
function TeacherList(){
    const [isFilterVisible, setIsVisible] = useState(false);

    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] =  useState<number[]>();


    const [subject, setSubject] = useState();
    const [week_day, setWeek_day] = useState();
    const [time, setTime] = useState();

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if(response){    
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) =>{
                    return teacher.id;
                })
                setFavorites(favoritedTeachersIds)   
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });
    
    function handleToogleFilterVisible(){
        setIsVisible(!isFilterVisible);
    }

    async function handleFiltersSubmit(){
        loadFavorites();
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });
        setIsVisible(false);
        setTeachers(response.data);
    }

    
    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToogleFilterVisible}>
                        <Feather name="filter" size={20} color="#FFF"/>
                    </BorderlessButton>
                )}
            >
                { isFilterVisible && (
                    <View style={styles.searchForm} >
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholderTextColor="#c1bcc" 
                            placeholder={"Qual a Matéria?"}
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da Semana</Text>
                                <TextInput
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeek_day(text)}
                                    placeholderTextColor="#c1bcc" 
                                    placeholder={"Qual o dia?"}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholderTextColor="#c1bcc" 
                                    placeholder={"Qual o horário?"}
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24
                }}
            >
                {teachers.map((teacher: Teacher) =>{
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}
               
            </ScrollView>
        </View>
    );
}

export default TeacherList;