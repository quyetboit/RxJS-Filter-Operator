import './style.css';

import {
  of,
  map,
  Observable,
  interval,
  fromEvent,
  from,
  throwError,
} from 'rxjs';
import {
  audit,
  auditTime,
  debounce,
  debounceTime,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  find,
  first,
  last,
  sample,
  sampleTime,
  single,
  skip,
  skipUntil,
  skipWhile,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  throttle,
  throttleTime,
} from 'rxjs/operators';

const observer = {
  next: (data) => console.log(data),
  error: (message) => console.error(message),
  complete: () => console.log('Complete'),
};

// ---------------------RxJS Filtering Operator----------------------------
// filter(): Lọc các giá trị được emit, sử dụng trong pipe()
// filter(): Nhận vào 1 đối số là 1 callback function, return true hoặc false
// Callback function này nhận vào 1 đối số là giá trị mà observable cha emit, nếu callback function này return true, thì dữ liệu sẽ được emit, nếu trả về false, giá trị sẽ được bỏ qua
of(1, 2, 3, 5, 2, 4, 5, 6).pipe(filter((x) => x > 4));

// first(): Là 1 operator sử dụng trong pipe, emit giá trị đầu tiên của observalbe rồi complete
// first() còn nhận vào 1 đối số (optional) là 1 callback function trả về giá trị boolean, nếu function này trả về true thì sẽ emit dữ liệu và complete luôn.
// Nếu observable cha không emit dữ liệu (Empty) hoặc không có giấ trị nào làm cho callback function trả về true thì sẽ throwError No element in sequence.
// first() còn nhận vào đối số thứ 2 (optional) là defaule value, nếu không có giá trị nào làm cho callback function trả về true thì sẽ emit default value này.
// Đối vói observable không complete thì sẽ không emit gì cũng không throwError
interval(1000).pipe(first((x) => x < 0));
of(1, 2, 3, 5, 2, 4, 5, 6).pipe(first((x) => x > 10, 'default value'));

// last(): Có các tính chất giống như first, nhưng sẽ emit giá trị cuối cùng của observable trước khi complete sau đó complete.
interval(1000).pipe(last());
of(1, 2, 3, 5, 2, 4, 5, 6).pipe(first((x) => x > 10, 'default value'));

// find(): Là 1 operator sử dụng trong pipe, lọc ra 1 giá trị thoả mãn điều kiện mong muốn
/**
 * find() nhận vào 1 đối số là 1 callback function trả về giá trị boolean
 * callback function nhận vào 1 đối số là giá trị mà observable cha emit, nếu giá function này return true thì sẽ emit giá trị đó và complete
 * find() sẽ không throwError nếu như không có giá trị nào làm callback function truyền vài nó trả về true.
 */
interval(1000).pipe(find((x) => x > 10));

// single(): Là 1 operator sử dụng trong pipe(), kiểm tra và lấy 1 giá trị duy nhất thoả mãn điều kiện mong muốn
/**
 * single() nhận vào 1 đối số là 1 callback function trả về giá trị boolean.
 * callback function này nhận vào 1 đối số là giá trị mà observable emit, nếu chỉ 1 giá trị trong số các giá trị mà observable emit làm callback function này trả về true thì sẽ emit giá trị đó rồi complete, nếu có nhiều hơn 1 hoặc không có giá trị nào sẽ throwError
 */
interval(1000).pipe(single((x) => x > 6));

// take(), takeUntil(), takeWhile(): Dùng để lấy các giá trị cho phép
// take(): Là 1 operator sử dụng trong pipe, quy định số lần emit của observable
/**
 * take() nhận vào 1 đối số là 1 number.
 * observable sẽ có số lần emit tối đa = số được truyền vào take()
 */
interval(1000).pipe(take(10));

// takeLats(): Giống như take nhưng lấy từ cuối lên, không áp dụng cho những observalbe không complete
interval(1000).pipe(take(10), takeLast(4));

// takeUntil(): Là 1 operator sử dụng trong pipe, emit các giá trị của observable cho đến khi notifier (truyền vào trong takeUntil()) rồi complete
/**
 * takeUntil() Nhận vào 1 đối số là 1 notifier (observalbe), observable sẽ emit giữ liệu cho đến khi notifier phát ra tín hiệu (emit) thì sẽ complete
 */
const click$ = fromEvent(document, 'click');
interval(1000).pipe(takeUntil(click$));

// takeWhile(): Operator sử dụng trong pipe, emit dữ liệu khi còn thoả mãn điều kiện nào đó, nếu không còn thoả mãn điều kiện thì sẽ complete luôn
/**
 * takeWhile() nhận vào đối số là 1 callback function trả về giá trị boolean.
 * Callback function này nhận vào 1 dối số là giá trị mà observable emit, nếu cllback function này trả về true thì observale sẽ emit dữ liệu, nếu trả về fasle thì lập tức complete
 */
of(1, 2, 3, 4, 3, 4, 2, 1).pipe(takeWhile((x) => x <= 3));

// skip(), skipUntil(), skipWhile(): Dùng để bỏ qua các giá trị
// Ngược lại với take() thì có skip(), các loại skip() sẽ có cách dùng tương tự như take
interval(1000).pipe(skip(4));
interval(1000).pipe(skipUntil(click$));
interval(1000).pipe(skipWhile((x) => x < 4));

// distinct(), distinctUntilChanged(), distinctUntilKeyChanged()
// distinct(): Operator sử dụng trong pipe, đảm bảo các giá trị giống nhau chỉ được emit 1 lần.
// Nếu như observable emit các object thì distinct() còn có thể nhận vào 1 đối số là 1 callback funciton, callback function sẽ trả về key mà muốn lọc trùng.
of(1, 2, 3, 2, 4, 2, 1, 4, 5).pipe(distinct());
from([
  {
    name: 'quyet',
    age: 20,
  },
  {
    name: 'trang',
    age: 20,
  },
  {
    name: 'quyet',
    age: 20,
  },
]).pipe(distinct((obj) => obj.name));

// distinctUntilChanged(): Là 1 operator sử dụng trong pipe, dùng để bỏ qua các emit liền kề bị trùng. Observable sẽ so sánh giá trị emit hiện tại với giá trị liền trước emit, nếu như trùng thì sẽ bị bỏ qua, không trùng sẽ emit
from([1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4]).pipe(distinctUntilChanged());

// distinctUntilKeyChanged(): Operator sử dụng trong pipe, sủ dụng với những observable emit object. Dùng để bỏ qua các emit có value của key được chỉ định trùng với value của key của emit liền trước nó. distinctUntilKeyChanged() nhận vào 1 đối số là key muốn so sành trùng.
of(
  { age: 4, name: 'Foo' },
  { age: 6, name: 'Foo' },
  { age: 7, name: 'Bar' },
  { age: 5, name: 'Foo' }
).pipe(distinctUntilKeyChanged('name'));

// throttle(), throttleTime()
// throttleTime() nhận vào 1 đối số là 1 khoảng thời gian tính bằng mls
// cách thức hoạt động của throttleTime(): observale gốc emit giá trị -> time chạy, trong quá trình chạy có emit sẽ bị bỏ qua -> time chạy xong, chở observable gốc emit -> emit -> reset time và tiếp tục chạy time ...
// throttle() hoạt động giống throttleTime() nhưng thay vì nhận vào duration nó sẽ nhận vào 1 callback function return 1 observable (Notifier), Khí notifier phát tín hiệu (Observale mà callback function return emit) thì observable gốc sẽ emit giá trị
interval(1000).pipe(throttleTime(1500));
interval(1000).pipe(throttle((val) => click$));

// debounce(), debounceTime()
// debounceTime() nhận vào 1 đối số là 1 duration tính bắng mls, trong khi duration đang chạy, mọi giá trị observable gốc sẽ bị bỏ qua, sau đó timmer chạy lại từ đầu, chỉ khi nào timmer được chạy hoàn chỉnh (chạy xong) thì sẽ emit giá trị gần nhất mà observable gốc emit trước đó
// debounce() có tính chất như debounceTime() sử dụng tương tự như debounce()
click$.pipe(debounceTime(1000));
fromEvent(document, 'mousemove').pipe(debounce((value) => click$));

// audit(), auditTime(): Sử dụng trong pipe
// auditTime(): Nhân vào 1 đối số là 1 duration tính bằng mls
// Cơ chế hoạt động: timmer chạy -> bỏ qua các emit -> timmer chạy xong -> emit giá trị gần nhất mà observable gốc emit -> timer tiếp tục chạy ...
interval(1000).pipe(auditTime(1500));

// sample(), sampleTime(): sử dụng trong pipe
// sample(): Nhận vào 1 dối số là 1 duration tính bắng mls
// Cơ chế hoạt động: emit giá trị của observable gốc -> timmer đang chạy -> bỏ qua các emit -> timmer chạy xong -> emit giá trị gần nhất mà observable gốc emit (có thể là trước hoặc sau khi timer chạy xong, cái nào gần hơn thì lấy)
interval(1000).pipe(sampleTime(1400));
