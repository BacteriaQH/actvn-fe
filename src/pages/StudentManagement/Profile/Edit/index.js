import { useRef, useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '~/components/Loading';
import {
    Form,
    Tab,
    Tabs,
    Row,
    Col,
    Button,
    FormGroup,
    FormLabel,
    FormControl,
    Image,
    FormSelect,
} from 'react-bootstrap';

import CustomAxios from '~/config/RequestConfig';
import Title from '~/components/Title';
import url from '~/config/ServerConfig';
const EditStudent = () => {
    const fileRef = useRef();
    const navigate = useNavigate();
    const match = useParams();
    const [image, setImage] = useState();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: ' ',
        firstname: '    ',
        lastname: '   ',
        gender: '1',
        image: '    ',
        bank_number: '     ',
        bank: '      ',
        school_year_id: '        ',
        dob: '        ',
        address: '         ',
        identify_number: '          ',
        identify_date: '           ',
        identify_address: '            ',
        province: '              ',
        district: '             ',
        ward: '                ',
        nationality: '                ',
        ethnic: '                  ',
        religion: '                   ',
        wish: '                   ',
        graduation_year: '                    ',
        family: '                     ',
        training_object: '                      ',
        affiliates: '                             ',
        family_phone: '                               ',
        office_phone: '                            ',
        email: '                             ',
        news_to_person: '                              ',
        news_to_address: '                               ',
        date_join_army: '                                ',
        level: '                                 ',
        cultural_level: '                                  ',
        unit: '                                   ',
        salary_type: '                                    ',
        salary_group: '                                     ',
        salary_level: '                                      ',
        salary_factor: '                                       ',
        salary_date: '                                        ',
        service: '                                        ',
        health: '                                          ',
        date_join_union: '                                           ',
        date_join_party: '                                            ',
        entry_date: '                                             ',
        graduation_date: '                                              ',
        job: '                                               ',
        laudatory: '                                                ',
        discipline: '                                                 ',
    });
    useEffect(() => {
        setIsLoading(true);
        CustomAxios.get(`/api/students/${match.id}`, {
            params: { id: match.id },
        }).then((res) => {
            if (res.data.code === 403) {
                alert('B???n kh??ng c?? quy???n truy c???p');
                navigate('/home');
            } else if (res.status === 200) {
                console.log(res.data);
                setImage(res.data.image);
                const nameF = res.data.name.split(' ');
                const last = nameF.pop();
                let str = '';
                nameF.map((val) => {
                    str = str + ' ' + val;
                    return str;
                });
                const first = str.trim();
                res.data.gender.toString() === 'true' ? (res.data.gender = '1') : (res.data.gender = '0');
                const { name, createdAt, updatedAt, ...other } = res.data;
                setFormData({
                    ...other,
                    firstname: first,
                    lastname: last,
                });
            }
            setIsLoading(false);
        });
    }, [match.id, navigate]);
    const handleChangeFile = async (e) => {
        e.preventDefault();
        const upload = new FormData();
        upload.append('file', e.target.files[0]);
        CustomAxios.post(`/api/upload`, upload).then((res) => {
            setImage(res.data.filename);
            setFormData({
                ...formData,
                [e.target.name]: `${res.data.filename}`,
            });
        });
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };
    const handleClick = (e) => {
        e.preventDefault();
        CustomAxios.post(`/api/students/update/${match.id}`, formData).then((res) => {
            res.data.code === 200 ? navigate('/students/profile/') : setMessage(res.data.message);
        });
    };
    return (
        <>
            <Title title={'Ch???nh S???a H???c Vi??n'} />
            <Tabs defaultActiveKey="student" transition={true} className="mb-3">
                {message ? <div className="text-danger">{message}</div> : <></>}
                <Tab eventKey="student" title="H???c Vi??n">
                    {isLoading && (
                        <Row>
                            <Col></Col>
                            <Col>
                                <Loading />
                            </Col>{' '}
                            <Col></Col>
                        </Row>
                    )}
                    <Title title={'H???c Vi??n'} />
                    <Row className="mb-3">
                        <Col>
                            <FormGroup as={Row} controlId="formFirstName">
                                <FormLabel>H??? ?????m</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Nh???p h??? ?????m"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup as={Row} controlId="formLastName">
                                <FormLabel>T??n</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Nh???p t??n"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            {image ? (
                                <Image
                                    src={`${url.SERVER_URL}/${image}`}
                                    alt={image}
                                    width={'150px'}
                                    height={'200px'}
                                />
                            ) : (
                                <FormGroup className="d-flex justify-content-center">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        onClick={() => fileRef.current.click()}
                                        className="fa-5x border border-primary p-4"
                                        color="#009cff "
                                    />
                                    <FormControl
                                        type="file"
                                        ref={fileRef}
                                        accept="image/*"
                                        className="d-none"
                                        onChange={handleChangeFile}
                                        name="image"
                                    />
                                </FormGroup>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formStudentId">
                            <FormLabel>M?? H???c Vi??n</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p m?? h???c vi??n"
                                name="code"
                                onChange={handleChange}
                                value={formData.code}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formGender">
                            <FormLabel>Gi???i t??nh</FormLabel>{' '}
                            <Form.Check
                                name="gender"
                                type={'radio'}
                                id={'male'}
                                label={'Nam'}
                                value={1}
                                checked={formData.gender === '1'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                name="gender"
                                type={'radio'}
                                id={'female'}
                                label={'N???'}
                                value={0}
                                checked={formData.gender === '0'}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formBankId">
                            <FormLabel>S??? T??i Kho???n</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p s??? t??i kho???n"
                                name="bank_number"
                                onChange={handleChange}
                                value={formData.bank_number}
                            />
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel>Ng??n H??ng</FormLabel>
                            <FormSelect name="bank" onChange={handleChange} value={formData.bank}>
                                <option>Ch???n ng??n h??ng</option>
                                <option value="NH1">Ng??n h??ng 1</option>
                                <option value="NH2">Ng??n h??ng 2</option>
                                <option value="NH3">Ng??n h??ng 3</option>
                            </FormSelect>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col}>
                            <FormLabel>H???c k??? nh???p h???c</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p h???c k??? nh???p h???c"
                                name="school_year_id"
                                onChange={handleChange}
                                value={formData.school_year_id}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formIdentifyId">
                            <FormLabel>CCCD/CMND</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p CCCD/CMND"
                                name="identify_number"
                                onChange={handleChange}
                                value={formData.identify_number}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formIdentifyDate">
                            <FormLabel>Ng??y c???p</FormLabel>
                            <FormControl
                                type="date"
                                placeholder="Nh???p ng??y c???p"
                                name="identify_date"
                                onChange={handleChange}
                                value={formData.identify_date}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formIdentifyAddress">
                            <FormLabel>N??i c???p</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p n??i c???p"
                                name="identify_address"
                                onChange={handleChange}
                                value={formData.identify_address}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} lg={6} controlId="formBirthday">
                            <FormLabel>Ng??y sinh</FormLabel>
                            <FormControl
                                type="date"
                                placeholder="Nh???p ng??y sinh"
                                name="dob"
                                onChange={handleChange}
                                value={formData.dob}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formAddress">
                            <FormLabel>?????a ch???</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p ?????a ch???"
                                name="address"
                                onChange={handleChange}
                                value={formData.address}
                            />
                        </FormGroup>
                    </Row>
                </Tab>
                <Tab eventKey="household" title="H??? Kh???u">
                    <Title title="H??? Kh???u" />
                    <FormGroup as={Col} controlId="formAddressProvince">
                        <FormLabel>T???nh/ Th??nh Ph???</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Nh???p t???nh/ th??nh ph???"
                            name="province"
                            onChange={handleChange}
                            value={formData.province}
                        />
                    </FormGroup>
                    <FormGroup as={Col} controlId="formAddressDistrict">
                        <FormLabel>Huy???n/ Qu???n</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Nh???p huy???n/ qu???n"
                            name="district"
                            onChange={handleChange}
                            value={formData.district}
                        />
                    </FormGroup>
                    <FormGroup as={Col} controlId="formAddressWard">
                        <FormLabel>X??/ Ph?????ng</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Nh???p x??/ ph?????ng"
                            name="ward"
                            onChange={handleChange}
                            value={formData.ward}
                        />
                    </FormGroup>
                </Tab>
                <Tab eventKey="object" title="?????i t?????ng">
                    <Title title="?????i t?????ng" />
                    <Row>
                        <FormGroup as={Col}>
                            <FormLabel>Qu???c t???ch</FormLabel>
                            <Form.Select name="nationality" onChange={handleChange} value={formData.nationality}>
                                <option>Ch???n qu???c t???ch</option>
                                <option>Vi???t Nam</option>
                                <option>L??o</option>
                                <option>Trung Qu???c</option>
                            </Form.Select>
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel>D??n t???c</FormLabel>
                            <Form.Select name="ethnic" onChange={handleChange} value={formData.ethnic}>
                                <option>Ch???n d??n t???c</option>
                                <option>Kinh</option>
                                <option>D??n t???c 2</option>
                                <option>D??n t???c 3</option>
                            </Form.Select>
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel>T??n gi??o</FormLabel>
                            <Form.Select name="religion" onChange={handleChange} value={formData.religion}>
                                <option>Ch???n t??n gi??o</option>
                                <option value="1">T??n gi??o 1</option>
                                <option value="2">T??n gi??o 2</option>
                                <option value="3">T??n gi??o 3</option>
                            </Form.Select>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Row} controlId="formWish">
                            <FormLabel>Tr??ng tuy???n theo nguy???n v???ng</FormLabel>
                            <FormControl type="text" name="wish" onChange={handleChange} value={formData.wish} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Row} controlId="formGraduationYear">
                            <FormLabel>N??m t???t nghi???p</FormLabel>
                            <FormControl
                                type="text"
                                name="graduation_year"
                                onChange={handleChange}
                                value={formData.graduation_year}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col}>
                            <FormLabel>Th??nh ph???n gia ????nh</FormLabel>
                            <Form.Select name="family" onChange={handleChange} value={formData.family}>
                                <option value="1">Th??nh ph???n 1</option>
                                <option value="2">Th??nh ph???n 2</option>
                                <option value="3">Th??nh ph???n 3</option>
                            </Form.Select>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col}>
                            <FormLabel>?????i t?????ng ????o t???o</FormLabel>
                            <Form.Select
                                name="training_object"
                                onChange={handleChange}
                                value={formData.training_object}
                            >
                                <option value="1">?????i t?????ng 1</option>
                                <option value="2">?????i t?????ng 2</option>
                                <option value="3">?????i t?????ng 3</option>
                            </Form.Select>
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel>????n v??? li??n k???t</FormLabel>
                            <Form.Select name="affiliates" onChange={handleChange} value={formData.affiliates}>
                                <option value="1">????n v??? li??n k???t 1</option>
                                <option value="2">????n v??? li??n k???t 2</option>
                                <option value="3">????n v??? li??n k???t 3</option>
                            </Form.Select>
                        </FormGroup>
                    </Row>
                </Tab>
                <Tab eventKey="contact" title="Li??n L???c">
                    <Title title="Li??n l???c" />
                    <Row>
                        <FormGroup as={Col} controlId="formPersonPhone">
                            <FormLabel>??i???n tho???i c?? nh??n</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p ??i???n tho???i c?? nh??n"
                                name="person_phone"
                                onChange={handleChange}
                                value={formData.person_phone}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formFamilyPhone">
                            <FormLabel>??i???n tho???i gia ????nh</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p ??i???n tho???i gia ????nh"
                                name="family_phone"
                                onChange={handleChange}
                                value={formData.family_phone}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formOfficePhone">
                            <FormLabel>??i???n tho???i c?? quan</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Nh???p ??i???n tho???i c?? quan"
                                name="office_phone"
                                onChange={handleChange}
                                value={formData.office_phone}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formEmail">
                            <FormLabel>Email</FormLabel>
                            <FormControl
                                type="email"
                                placeholder="Nh???p Email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="formNewsTo">
                            <FormLabel>B??o tin cho </FormLabel>
                            <FormControl
                                type="text"
                                name="news_to_person"
                                onChange={handleChange}
                                value={formData.news_to_person}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="formNewsToAddress">
                            <FormLabel>??? ????u</FormLabel>
                            <FormControl
                                type="text"
                                name="news_to_address"
                                onChange={handleChange}
                                value={formData.news_to_address}
                            />
                        </FormGroup>
                    </Row>
                </Tab>
                <Tab eventKey="info" title="Th??ng Tin Qu??n Nh??n">
                    <Title title="Th??ng Tin Qu??n Nh??n" />
                    <Row>
                        <FormGroup as={Col} controlId="DateJoinArmy">
                            <FormLabel>Th??ng/ N??m nh???p ng?? </FormLabel>
                            <FormControl
                                type="text"
                                name="date_join_army"
                                onChange={handleChange}
                                value={formData.date_join_army}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="Level">
                            <FormLabel>C???p b???c</FormLabel>
                            <FormControl type="text" name="level" onChange={handleChange} value={formData.level} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="CulturalLevel">
                            <FormLabel>Tr??nh ????? v??n ho??</FormLabel>
                            <FormControl
                                type="text"
                                name="cultural_level"
                                onChange={handleChange}
                                value={formData.cultural_level}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="Unit">
                            <FormLabel>????n v??? c??? ??i h???c</FormLabel>
                            <FormControl type="text" name="unit" onChange={handleChange} value={formData.unit} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="SalaryType">
                            <FormLabel>Lo???i l????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="salary_type"
                                onChange={handleChange}
                                value={formData.salary_type}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="SalaryGroup">
                            <FormLabel>Nh??m l????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="salary_group"
                                onChange={handleChange}
                                value={formData.salary_group}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="SalaryLevel">
                            <FormLabel>B???c l????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="salary_level"
                                onChange={handleChange}
                                value={formData.salary_level}
                            />
                        </FormGroup>
                        <FormGroup as={Col} controlId="SalaryFactor">
                            <FormLabel>H??? s??? l????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="salary_factor"
                                onChange={handleChange}
                                value={formData.salary_factor}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="SalaryDate">
                            <FormLabel>Th??ng/ N??m nh???n l????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="salary_date"
                                onChange={handleChange}
                                value={formData.salary_date}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Service">
                            <FormLabel>Ch???c v???</FormLabel>
                            <FormControl type="text" name="service" onChange={handleChange} value={formData.service} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Health">
                            <FormLabel>S???c kho???</FormLabel>
                            <FormControl type="text" name="health" onChange={handleChange} value={formData.health} />
                        </FormGroup>
                    </Row>
                </Tab>
                <Tab eventKey="other" title="Kh??c">
                    <Title title="Kh??c" />
                    <Row>
                        <FormGroup as={Col} controlId="JoinDateUnion">
                            <FormLabel>Ng??y v??o ??o??n</FormLabel>
                            <FormControl
                                type="text"
                                name="date_join_union"
                                onChange={handleChange}
                                value={formData.date_join_union}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="JoinDateParty">
                            <FormLabel>Ng??y v??o ?????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="date_join_party"
                                onChange={handleChange}
                                value={formData.date_join_party}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="EntryDate">
                            <FormLabel>Ng??y v??o tr?????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="entry_date"
                                onChange={handleChange}
                                value={formData.entry_date}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="GraduationDate">
                            <FormLabel>Ng??y ra tr?????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="graduation_date"
                                onChange={handleChange}
                                value={formData.graduation_date}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Job">
                            <FormLabel>Ngh??? nghi???p/ Ch???c v???</FormLabel>
                            <FormControl type="text" name="job" onChange={handleChange} value={formData.job} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Laudatory">
                            <FormLabel>Khen th?????ng</FormLabel>
                            <FormControl
                                type="text"
                                name="laudatory"
                                onChange={handleChange}
                                value={formData.laudatory}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Discipline">
                            <FormLabel>K??? lu???t</FormLabel>
                            <FormControl
                                type="text"
                                name="discipline"
                                onChange={handleChange}
                                value={formData.discipline}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup as={Col} controlId="Note">
                            <FormLabel>Ghi ch??</FormLabel>
                            <FormControl type="text" name="note" onChange={handleChange} />
                        </FormGroup>
                    </Row>
                </Tab>
            </Tabs>
            <Button variant="primary" className="mt-3" onClick={handleClick}>
                Ch???nh s???a h???c vi??n
            </Button>
        </>
    );
};
export default EditStudent;
