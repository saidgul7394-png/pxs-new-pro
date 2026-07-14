cmake_minimum_required(VERSION 3.14)
project(psx_vision_pro LANGUAGES CXX)

set(BINARY_NAME "psx_vision_pro")
add_executable(${BINARY_NAME} runner/main.cpp)
