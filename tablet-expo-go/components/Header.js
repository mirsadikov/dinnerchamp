import React from 'react';
import { StyleSheet, Switch, Button, View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EMPLOYEE_LOGOUT, RESTAURANT_SET_STATUS, SET_SELECTED_ORDER } from '../constants.js';
import socketServcies from '../config/socket';

const Header = ({ menuIsOpen, setMenuIsOpen }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.restaurant);

  const handleToggle = () => {
    if (!menuIsOpen) dispatch({ type: SET_SELECTED_ORDER });
    setMenuIsOpen((v) => !v);
  };

  const handleRestaurantToggle = () => {
    dispatch({ type: RESTAURANT_SET_STATUS, payload: !status });
    socketServcies.emit('restaurant:switch', { isOnline: !status });
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleToggle}
          underlayColor="#fff"
        >
          <Text style={styles.buttonText}>Options</Text>
        </TouchableOpacity>
        {/* <Button title="Options" onPress={handleToggle} color="#fff" /> */}
        <View style={styles.switch}>
          <Text style={styles.text}>Offline</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={status ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleRestaurantToggle}
            value={status}
          />
          <Text style={styles.text}>Online</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({ type: EMPLOYEE_LOGOUT });
          }}
          underlayColor="#fff"
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        {/* <Button
          title="Logout"
          color="#fff"
          onPress={() => {
            dispatch({ type: EMPLOYEE_LOGOUT });
          }}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff4b00',
    paddingTop: 24,
    shadowColor: '#666',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  headerContainer: {
    height: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff4b00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: '#fff',
  },
});

export default Header;
