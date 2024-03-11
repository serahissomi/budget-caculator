import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
  
  // 입력 필드 스타일 메서드
  inputStyle = () => {
    return {
      display: "flex",
      flexDirection: "column",
    };
  };

  // 삭제 버튼 스타일 객체
  btnStyle = {
    color: "#fff",
    border: "none",
    padding: "5px 9px",
    borderRadius: "50%",  
    cursor: "pointer",
    float: "right",
  };

  // 각 리스트 스타일 메서드
  getStyle = () => {
    return {
      padding: "10px",
      border: "dotted 1px gray",
      margin: "10px",
      display: "flex",
      justifyContent: "space-between",
    };
  };

  // 항목 삭제 처리 메서드
  handleClick = (id) => {
    // 선택한 항목 상태에서 제거
    this.setState({
      resultData: this.state.resultData.filter(data => data.id !== id)
    });
  };

  // 애플리케이션 상태 초기화
  state = {
    resultData: [], // 결과 데이터 배열
    value: "", // 입력 필드 값
    cost: "", // 비용 필드 값
    editingId: null, // 현재 편집 중인 항목의 ID

    // 알림 상태
    alert: {
      message: '', // 알림 메시지
      isActive: false, // 알림 활성화 여부
    }
  };

  // 입력 필드 변경 메서드
  handleChange = (e) => {
    // 입력 필드의 값에 따라 상태 업데이트
    this.setState({ [e.target.name]: e.target.value });
  };

  // 수정 버튼 클릭 메서드
  handleEditClick = (id) => {
    // 수정할 항목 찾기
    const item = this.state.resultData.find(data => data.id === id);
    if (item) {
      // 찾은 항목으로 입력 필드 값을 설정
      this.setState({
        value: item.title,
        cost: item.cost,
        editingId: id,
      });
    }
  };

  // 제출 버튼 클릭을 처리하는 메서드
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.editingId) {
      // 수정 모드일 경우의 로직
      const updatedData = this.state.resultData.map(item => {
        if (item.id === this.state.editingId) {
          return { ...item, title: this.state.value, cost: this.state.cost };
        }
        return item;
      });
      this.setState({
        resultData: updatedData,
        editingId: null,
      });
      this.showAlert('항목이 수정되었습니다.');
    } else {
      // 새 항목 추가 로직
      const newItem = {
        id: Date.now().toString(),
        title: this.state.value,
        cost: this.state.cost,
      };
      this.setState({
        resultData: [...this.state.resultData, newItem]
      });
      this.showAlert('항목이 추가되었습니다.');
    }
    // 입력 필드 초기화
    this.setState({ value: "", cost: "" });
  };

  // 알림 메시지를 설정하고 표시하는 메서드
  showAlert = (message) => {
    this.setState({ 
      alert: {
        message,
        isActive: true,
      }
    });

    // 2초 후 알림 비활성화
    setTimeout(() => {
      this.setState({ 
        alert: {
          message: '',
          isActive: false,
        }
      });
    }, 2000);
  };

  // 모든 목록 항목을 삭제하는 메서드
  clearList = () => {
    this.setState({ resultData: [] });
  };

  render() {
    // 총 지출 계산
    const totalExpense = this.state.resultData.reduce((total, item) => total + Number(item.cost), 0);

    return (
      <div className="container">
        {/* 알림 박스 */}
        {this.state.alert.isActive && (
          <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", marginBottom: "20px", border: "1px solid #f5c6cb", borderRadius: "4px", textAlign: "center" }}>
            {this.state.alert.message}
          </div>
        )}

        {/* 제목 표시 */}
        <div style={{ textAlign: 'left', width: '100%' }}>
          <h1>예산 계산기</h1>
        </div>
        
        {/* 지출 항목 및 비용 입력 폼 */}
        <div className="box">
          <form className="box-header" style={this.inputStyle()} onSubmit={this.handleSubmit}>
            {/* 입력 필드 */}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              {/* 지출 항목 입력 필드 */}
              <div className="list">
                <h3>지출 항목</h3>
                <input 
                  type="text"
                  name="value"
                  style={{ flex: "10", padding: "5px" }}
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </div>
              {/* 비용 입력 필드 */}
              <div className="cost">
                <h3>비용</h3>
                <input 
                  type="text"
                  name="cost"
                  style={{ flex: "10", padding: "5px" }}
                  value={this.state.cost}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            {/* 제출 버튼 */}
            <div>
              <input 
                type="submit"
                value={this.state.editingId ? "수정" : "저장"}
                className="btn"
                style={{ width: "50px", marginTop: "10px", marginLeft:"auto"}}
              />
            </div>
          </form>
  
          {/* 입력된 데이터 목록 표시 */}
          {this.state.resultData.map(data => (
            <div style={this.getStyle()} key={data.id}>
              <div>{data.title}</div>
              <div>{data.cost}</div>
          
              {/* 버튼 컨테이너 */}
              <div>
                {/* 수정 버튼 */}
                <button style={this.btnStyle} onClick={() => this.handleEditClick(data.id)}>
                  <i className="fas fa-pencil-alt" style={{ color: '#8EACCD' }}></i>
                </button>
                
                {/* 삭제 버튼 */}
                <button style={this.btnStyle} onClick={() => this.handleClick(data.id)}>
                  <i className="fas fa-trash" style={{ color: '#8EACCD' }}></i>
                </button>
              </div>
            </div>
          ))}
          {/* 목록 지우기 버튼 */}
          <button className="btn" onClick={this.clearList}>전체 목록 지우기</button>
        </div>
        
        {/* 총 지출 표시 */}
        <div style={{ textAlign: 'right', width: '100%' }}>
          <h2>총 지출: {totalExpense}원</h2>
        </div>
      </div>
    );
  }
}