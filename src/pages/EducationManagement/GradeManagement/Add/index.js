import CustomAxios from '~/config/RequestConfig';
import { useEffect, useState } from 'react';
import { Col, FormGroup, FormLabel, FormSelect, Row, Button, Table, FormControl } from 'react-bootstrap';

import Title from '~/components/Title';

import Loading from '~/components/Loading';
function AddGrade() {
    const [classes, setClasses] = useState('');
    const [classSelect, setClassSelect] = useState('');
    const [subjects, setSubjects] = useState('');
    const [grade, setGrade] = useState('');
    const [subjectSelect, setSubjectSelect] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({
        err: false,
        mess: '',
    });
    useEffect(() => {
        setIsLoading(true);
        CustomAxios.post(`/api/query`, ['classes']).then((res) => {
            setClasses(res.data.classes);
        });
        CustomAxios.get(`/api/subjects/list`).then((res) => {
            setSubjects(res.data);
            setIsLoading(false);
        });
    }, []);

    const handleChangeClass = (e) => {
        setClassSelect(e.target.value);
    };
    const handleChangeSubject = (e) => {
        setSubjectSelect(e.target.value);
    };

    const handleFetchData = () => {
        setIsLoading(true);
        CustomAxios.get(`/api/grades/find-grade-by-subject-class`, {
            params: {
                subject: subjectSelect,
                classes: classSelect,
            },
        }).then((res) => {
            setGrade(res.data);
            setIsLoading(false);
        });
    };

    const handleChange = (e, id) => {
        let nGrade = grade.map((g) => {
            if (g.id === id) {
                g.subject[0].grade[e.target.name] = Number(e.target.value);
            }
            return g;
        });
        setGrade(nGrade);
    };
    const handleClick = () => {
        let error = [];
        let uGrade = [];
        let nGrade = [];
        grade.map((g) => {
            if (g.subject[0].grade.id) {
                uGrade.push(g);
            } else {
                nGrade.push(g);
            }
        });
        setIsLoading(true);
        if (nGrade.length > 0) {
            CustomAxios.post(`/api/grades/add`, nGrade).then((res) => {
                if (res.data.code === 401) {
                    error.push(1);
                } else if (res.data.code === 200) {
                    error.push(0);
                }
                setIsLoading(false);
            });
        } else if (uGrade.length > 0) {
            CustomAxios.post(`/api/grades/update`, uGrade).then((res) => {
                if (res.data.code === 401) {
                    error.push(1);
                } else if (res.data.code === 200) {
                    error.push(0);
                }
                setIsLoading(false);
            });
        }

        if (error.includes(1)) {
            setMessage({
                err: true,
                mess: 'C?? l???i x???y ra',
            });
        } else {
            setMessage({
                err: false,
                mess: 'Th??nh c??ng',
            });
        }
    };
    return (
        <>
            <Title title="Th??m ??i???m" />
            {message.mess ? <div className={message.err ? 'text-danger' : 'text-success'}>{message.mess}</div> : <></>}
            {isLoading && (
                <Row>
                    <Col></Col>
                    <Col>
                        <Loading />
                    </Col>{' '}
                    <Col></Col>
                </Row>
            )}
            <Row>
                <FormGroup as={Col}>
                    <FormLabel>H???c ph???n</FormLabel>
                    <FormSelect onChange={handleChangeSubject}>
                        <option>Ch???n h???c ph???n</option>
                        {subjects &&
                            subjects.map((subject) => (
                                <option value={subject.id} key={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                    </FormSelect>
                </FormGroup>
                <FormGroup as={Col}>
                    <FormLabel>L???p</FormLabel>
                    <FormSelect onChange={handleChangeClass}>
                        <option>Ch???n l???p</option>
                        {classes && classes.map((nClass, index) => <option key={nClass.id}>{nClass.name}</option>)}
                    </FormSelect>
                </FormGroup>
            </Row>
            <Button variant="primary" onClick={handleFetchData} className="m-3">
                {' '}
                L???y danh s??ch h???c vi??n
            </Button>
            {grade && (
                <>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">H??? v?? T??n</th>
                                <th scope="col">M?? Sinh Vi??n</th>
                                <th scope="col" width="80px">
                                    TP1
                                </th>
                                <th scope="col" width="80px">
                                    TP2
                                </th>
                                <th scope="col" width="80px">
                                    Thi L1
                                </th>
                                <th scope="col" width="80px">
                                    Thi L2
                                </th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grade.map((g, index) => (
                                <tr key={g.id}>
                                    <th scope="row">{++index}</th>
                                    <td>{g.name}</td>
                                    <td>{g.code}</td>
                                    <td>
                                        <FormControl
                                            type="number"
                                            name="grade1"
                                            min={0}
                                            max={10}
                                            value={g.subject[0].grade.grade1 ? g.subject[0].grade.grade1 : ''}
                                            onChange={(e) => handleChange(e, g.id)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            type="number"
                                            name="grade2"
                                            min={0}
                                            max={10}
                                            value={g.subject[0].grade.grade2 ? g.subject[0].grade.grade2 : ''}
                                            onChange={(e) => handleChange(e, g.id)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            type="number"
                                            name="exam1"
                                            min={0}
                                            max={10}
                                            value={g.subject[0].grade.exam1 ? g.subject[0].grade.exam1 : ''}
                                            onChange={(e) => handleChange(e, g.id)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            type="number"
                                            name="exam2"
                                            min={0}
                                            max={10}
                                            value={g.subject[0].grade.exam2 ? g.subject[0].grade.exam2 : ''}
                                            onChange={(e) => handleChange(e, g.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button onClick={handleClick} className="btn btn-primary mt-3">
                        Th??m ??i???m
                    </Button>
                </>
            )}
        </>
    );
}

export default AddGrade;
